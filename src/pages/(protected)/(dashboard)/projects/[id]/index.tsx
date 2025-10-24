import React from "react"
import { useDeleteProject, useGetProject } from "@commons/api/projects"
import { useParams, useRouter } from "@router"
import ProjectEditor from "../_component/Editor.component"
import { showConfirmationModal } from "@components/ConfirmationModal"
import { toast } from "sonner"
import { useGlobalStore } from "@/src/commons/store"

export default function EditProject({}) {
	const { id } = useParams()

	const { data: project } = useGetProject(id)

	const { loader } = useGlobalStore()
	const router = useRouter()
	const { data: deleteProject } = useDeleteProject(id)

	const onDelete = () => {
		showConfirmationModal({
			title: "Delete Team Member",
			message: "Are you sure you want to delete this team member? This action cannot be undone.",
			onConfirm: () => {
				loader.start()
				deleteProject()
					.then(() => {
						toast.success("Team member deleted successfully")
						router.push("/team")
					})
					.finally(() => loader.reset())
			},
		})
	}

	return (
		<ProjectEditor
			title="View Project"
			subtitle="View the details of your project."
			viewType="view"
			initialData={project}
			onSubmit={() => {}}
			isLoading={false}
		/>
	)
}
