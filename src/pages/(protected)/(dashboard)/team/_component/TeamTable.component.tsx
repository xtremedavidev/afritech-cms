import { useRouter } from "@router"
import { useGlobalStore } from "@/src/commons/store"
import TeamMemberCard from "@src/pages/(protected)/(dashboard)/team/_component/TeamMemberCard.component"

export function statusColor(status: ITeamMember["isActive"], text?: boolean) {
	switch (status) {
		case true:
			return !text ? "bg-primary/20" : "text-primary dark:text-primary"
		case false:
		default:
			return !text ? "bg-gray-500/20" : "text-gray-700 dark:text-gray-400"
	}
}

export default function TeamTable({ data }: { data: ITeamMember[] }) {
	const router = useRouter()
	const { loader } = useGlobalStore()

	return (
		<div className={" grid grid-cols-3 gap-x-4 mt-6 "}>
			{data?.map((member) => (
				<TeamMemberCard member={member} />
			))}
		</div>
	)
}
