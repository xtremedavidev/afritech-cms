import React from "react"
import { useDeleteProject, useGetProject, useUpdateProject } from "@commons/api/projects"
import { useGlobalStore } from "@store"
import { useParams, useRouter } from "@router"
import ProjectEditor from "../_component/Editor.component"
import { toast } from "sonner"
import { showConfirmationModal } from "@components/ConfirmationModal"

export default function EditProject({}) {
	const router = useRouter()
	const { id } = useParams()

	const { loader } = useGlobalStore()

	const { mutateAsync: updateProject, isPending: isUpdating } = useUpdateProject(id)
	const { mutateAsync: deleteProject, isPending: isDeleting } = useDeleteProject(id)
	const { data: project } = useGetProject(id)

	const onSubmit = ({ data, files }: { data: any; files: Record<string, File>; draft }) => {
		loader.start()
		updateProject({ ...data, files })
			.then((res) => toast.success("Project updated!"))
			.finally(() => loader.reset())
	}

	const onDelete = () => {
		showConfirmationModal({
			title: "Delete Project",
			message: "Are you sure you want to delete this project? This action cannot be undone.",
			onConfirm: () => {
				loader.start()
				deleteProject()
					.then(() => {
						toast.success("Project deleted successfully")
						router.push("/projects")
					})
					.finally(() => loader.reset())
			},
		})
	}

	return (
		<ProjectEditor
			title="Edit Project"
			subtitle="Edit and make changes to your project."
			viewType="edit"
			initialData={project}
			onSubmit={onSubmit}
			onDelete={onDelete}
			isLoading={isUpdating}
		/>
	)
}
