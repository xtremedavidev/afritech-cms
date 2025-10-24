import CustomText from "@components/CustomText"
import React, { ReactElement } from "react"
import { twMerge } from "tailwind-merge"

interface Props {
	className?: string
	data: IHighlightItem[]
}

const HighlightsView = ({ className, data = [] }: Props) => {
	return (
		<div className={twMerge("my-2 flex flex-col gap-3 md:flex-row", className)}>
			{data
				.filter((x) => x.visible)
				.map((item, i) => (
					<HighlightCard
						key={i}
						{...item}
					/>
				))}
		</div>
	)
}

export default HighlightsView

interface IHighlightCard extends IHighlightItem {
	className?: string
}

declare global {
	interface IHighlightItem {
		title: string
		visible: boolean
		value: number | string
		accentClassName?: string
		icon: ReactElement
	}
}

const HighlightCard = ({ className, title, value, accentClassName, icon }: IHighlightCard) => {
	return (
		<div className="border-outline flex w-full flex-row justify-between overflow-clip rounded-lg border bg-gray-600/5  dark:bg-gray-400/5">
			<div className={twMerge(`flex w-[40%] items-center justify-center p-6`, accentClassName)}>
				{React.cloneElement(icon, { width: 40 } as any)}
			</div>
			<div className="flex flex-1 flex-col p-4 py-5">
				<CustomText
					className="font-heading text-2xl font-bold"
					text={value ?? 0}
				/>
				<CustomText className="text-text-faded text-sm"> {title}</CustomText>
			</div>
		</div>
	)
}
