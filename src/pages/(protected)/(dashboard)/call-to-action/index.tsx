import { useGetCTA } from "@/src/commons/api/call-to-action"
import { twMerge } from "tailwind-merge"
import CallToActionEditor from "./_component/Editor.component"

interface Props {
	className?: string
	search?: string
	startDate?: string
	endDate?: string
	limit?: number
	sortBy?: string
	sortOrder?: "DESC" | "ASC"
}

const CallToActionPage = ({ className }: Props) => {
	// fetch initial data
	const { data = [] } = useGetCTA({ page: 1, limit: 1 })

	return (
		<div className={twMerge("flex w-full flex-col gap-y-4 px-4 pb-[5%]", className)}>
			<CallToActionEditor
				title="Call to action"
				subtitle="Edit the call to action section on your website."
				viewType="create"
				initialData={data?.[0]}
			/>
		</div>
	)
}

export default CallToActionPage
