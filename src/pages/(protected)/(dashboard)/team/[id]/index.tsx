import React from "react"
import { useDeleteTeamMember, useGetTeamMember, useUpdateTeamMember } from "@commons/api/teams"
import { useParams, useRouter } from "@router"
import TeamEditor from "@src/pages/(protected)/(dashboard)/team/_component/TeamEditor.component"
import { toast } from "sonner"
import { showConfirmationModal } from "@components/ConfirmationModal"
import { useGlobalStore } from "@/src/commons/store"

export default function EditTeam({}) {
	const { id } = useParams()

	const { loader } = useGlobalStore()
	const router = useRouter()

	const { mutateAsync: deleteTeam, isPending: isDeleting } = useDeleteTeamMember(id)
	const { data: member } = useGetTeamMember(id)

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
			title="View Team Member"
			subtitle="View the details of your team member."
			viewType="view"
			initialData={member}
			onSubmit={() => {}}
			onDelete={onDelete}
			isLoading={false}
		/>
	)
}
