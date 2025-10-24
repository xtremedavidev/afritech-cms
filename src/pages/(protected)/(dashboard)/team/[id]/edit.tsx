import React from "react"
import { useDeleteTeamMember, useGetTeamMember, useUpdateTeamMember } from "@commons/api/teams"
import { useGlobalStore } from "@store"
import { useParams, useRouter } from "@router"
import TeamEditor from "@src/pages/(protected)/(dashboard)/team/_component/TeamEditor.component"
import { toast } from "sonner"
import { showConfirmationModal } from "@components/ConfirmationModal"

export default function EditTeamMember({}) {
	const router = useRouter()
	const { id } = useParams()

	const { loader } = useGlobalStore()

	const { mutateAsync: updateTeam, isPending: isUpdating } = useUpdateTeamMember(id)
	const { mutateAsync: deleteTeam, isPending: isDeleting } = useDeleteTeamMember(id)
	const { data: member } = useGetTeamMember(id)

	const onSubmit = ({ data, files }: { data: any; files: Record<string, File>; draft }) => {
		loader.start()
		updateTeam({ ...data, files })
			.then((res) => toast.success("Team member updated!"))
			.finally(() => loader.reset())
	}

	const onDelete = () => {
		showConfirmationModal({
			title: "Delete Team Member",
			message: "Are you sure you want to delete this team member? This action cannot be undone.",
			onConfirm: () => {
				loader.start()
				deleteTeam()
					.then(() => {
						toast.success("Team member deleted successfully")
						router.push("/team")
					})
					.finally(() => loader.reset())
			},
		})
	}

	return (
		<TeamEditor
			title="Edit Profile"
			subtitle="Edit and make changes to your team member's profile."
			viewType="edit"
			initialData={member}
			onSubmit={onSubmit}
			onDelete={onDelete}
			isLoading={isUpdating}
		/>
	)
}
