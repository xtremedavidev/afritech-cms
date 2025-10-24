import React from "react"
import { useCreateTeamMember } from "@commons/api/teams"
import { useGlobalStore } from "@store"
import { useRouter } from "@router"
import TeamEditor from "@src/pages/(protected)/(dashboard)/team/_component/TeamEditor.component"

export default function CreateTeam({}) {
	const { loader } = useGlobalStore()

	const router = useRouter()
	const { mutateAsync: createTeam, isPending: isCreating } = useCreateTeamMember()

	const onSubmit = ({ data, files, draft }: { data: any; files: Record<string, File>; draft: boolean }) => {
		loader.start()
		createTeam({ ...data, files })
			.then((res) => {
				router.push(`/team`)
			})
			.finally(() => loader.reset())
	}

	return (
		<TeamEditor
			title="Add Team Member"
			subtitle="Create a new team member."
			viewType="create"
			initialData={null}
			onSubmit={onSubmit}
			isLoading={isCreating}
		/>
	)
}
