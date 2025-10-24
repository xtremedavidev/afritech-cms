import React from "react"
import CustomText from "@components/CustomText"
import moment from "moment"
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid"

interface Props {
	className?: string
	data?: {
		id: number
		label: string
		description: string
		time: string
		completed: boolean
	}[]
}

const TimelineView = ({ data: orderStatusData = [] }: Props) => {
	const renderItem = ({ item, index }) => {
		return (
			<div className={"flex flex-1 flex-row"}>
				<div className={`flex h-full flex-col items-center`}>
					{item.completed ? (
						<CheckCircleIcon className={"w-6 text-primary"} />
					) : (
						<ClockIcon className={"w-6 text-gray-400 dark:text-gray-700"} />
					)}

					{index !== orderStatusData.length - 1 && index < orderStatusData.length && (
						<div
							className={`h-full min-h-20 w-0.5 flex-1 rounded-lg ${orderStatusData[index + 1].completed ? "bg-primary dark:bg-primary" : "bg-gray-400 dark:bg-gray-700"}`}
						/>
					)}
				</div>

				<div className={`ml-3 flex-1 flex-row ${index !== orderStatusData?.length - 1 ? "mb-8" : ""}`}>
					<div className="flex w-[75%] flex-col">
						<CustomText
							text={item?.label}
							className={`mb-[1px] font-heading text-[16px] ${item.completed ? "text-primary dark:text-primary-light" : "text-gray-400"}`}
						/>
						<CustomText className={"my-1 text-[13px] text-gray-600 dark:text-gray-400"}>
							{item.description}
						</CustomText>
					</div>
					{item?.time && (
						<div className="flex w-[25%] flex-col items-end">
							<CustomText
								text={moment(item.time).format("Do MMM, YYYY")}
								className={"w-fit text-xs  text-gray-700 dark:text-gray-300"}
							/>
							<CustomText
								text={moment(item.time).format("hh:mm a")}
								className={"w-fit text-xs  text-gray-700 dark:text-gray-300"}
							/>
						</div>
					)}
				</div>
			</div>
		)
	}

	return <>{orderStatusData?.map((item, index) => renderItem({ item, index }))}</>
}

export default TimelineView
