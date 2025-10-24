import { twMerge } from "tailwind-merge"
import HighlightsView from "@components/project/Highlights.view"
import React from "react"
import CustomText from "@components/CustomText"
import { useRouter } from "@router"
import { formatNumber } from "@utils"
import DateRangePicker from "@components/ui/date-range-picker"
import moment from "moment"
import { CustomIcons } from "@/src/commons/assets/icons"
import { useGetMetrics } from "@commons/api/general"
import BlogsTable from "@src/pages/(protected)/(dashboard)/blogs/_component/BlogsTable.component"
import ProjectsTable from "@src/pages/(protected)/(dashboard)/projects/_component/ProjectsTable.component"

interface Props {
	className?: string
}

const HomePage = ({ className }: Props) => {
	const router = useRouter()
	const [fromDate, setFromDate] = React.useState<Date>(new Date("2024-07-01"))
	const [toDate, setToDate] = React.useState<Date>(new Date())

	const { data: metrics } = useGetMetrics()

	const highlights: IHighlightItem[] = [
		{
			title: "Published Blogs",
			visible: true,
			value: formatNumber(metrics?.overview?.blogs?.published),
			accentClassName: "bg-green-500/10 text-green-500",
			icon: <CustomIcons.Filled.FileText />,
		},
		{
			title: "Published Projects",
			visible: true,
			value: formatNumber(metrics?.overview?.projects?.published),
			accentClassName: "bg-yellow-500/10 text-yellow-500",
			icon: <CustomIcons.Filled.Watch />,
		},
		{
			title: "Active Services",
			visible: true,
			value: formatNumber(metrics?.overview?.services?.active),
			accentClassName: "bg-blue-500/10 text-blue-500",
			icon: <CustomIcons.Filled.CrossHair />,
		},
		{
			title: "Total People",
			visible: true,
			value: formatNumber(metrics?.overview?.team?.total),
			accentClassName: "bg-red-500/10 text-red-500",
			icon: <CustomIcons.Filled.XOctagon />,
		},
	]

	return (
		<div className={twMerge("flex w-full flex-col gap-y-4 px-4 pb-[5%]", className)}>
			<div className="mt-4 flex w-full items-center justify-between">
				<CustomText className="font-heading text-2xl font-bold">Overview</CustomText>
				<div className={"my-3 flex gap-x-4"}>
					<DateRangePicker
						onUpdate={(values) => {
							setFromDate(values.range.from)
							setToDate(values.range.to)
						}}
						initialDateFrom={moment().subtract(7, "days").format("YYYY-MM-DD")}
						initialDateTo={moment().format("YYYY-MM-DD")}
						align="start"
						showCompare={false}
					/>
				</div>
			</div>
			<HighlightsView data={highlights} />

			<div>
				<CustomText className="font-heading mb-4 mt-5 text-lg font-bold">Recently Added Blog Posts</CustomText>
				<BlogsTable data={metrics?.recentActivity?.blogs || []} />
			</div>

			<div>
				<CustomText className="font-heading mb-4 mt-5 text-lg font-bold">Recently Added Projects</CustomText>
				<ProjectsTable data={metrics?.recentActivity?.projects || []} />
			</div>
		</div>
	)
}

export default HomePage
