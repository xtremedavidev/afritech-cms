import React from "react"
import { twMerge } from "tailwind-merge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select"

interface DropdownSelectItem {
	value: string
	label: string
	icon?: string | React.ReactElement
	render?: (item: DropdownSelectItem, handleClose: () => void) => React.ReactNode
}

interface DropdownSelectProps {
	className?: string
	containerClassName?: string
	noItemMessage?: string
	label?: string
	icon?: string
	labelClassName?: string
	prompt?: string
	disabled?: boolean
	items: (string | DropdownSelectItem)[]
	selected: any
	setSelected: (value: any) => void
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
														   className = "",
														   containerClassName = "",
														   noItemMessage = "No items",
														   disabled = false,
														   label,
														   icon,
														   labelClassName = "",
														   prompt = "-- Choose an item --",
														   setSelected,
														   items = [],
														   selected,
													   }: DropdownSelectProps) => {
	const Selector = () => {
		return (
			<Select
				disabled={disabled}
				onValueChange={(value) => setSelected(value)}>
				<SelectTrigger
					className={twMerge(
						"border-input min-w-[180px] cursor-pointer rounded-lg border hover:ring-1",
						className,
					)}>
					{icon ? (
						<div className="flex">
							<img
								alt={"selected-option-image"}
								src={icon}
								className={"mr-2 aspect-square w-6 rounded-full object-cover"}
							/>
							<SelectValue
								className={twMerge("font-heading font-medium", labelClassName)}
								placeholder={selected?.label ?? prompt}
							/>
						</div>
					) : (
						<SelectValue
							className={twMerge("font-heading font-medium", labelClassName)}
							placeholder={selected?.label ?? prompt}
						/>
					)}
				</SelectTrigger>
				<SelectContent className={"bg-background border-outline z-[15000]"}>
					{items?.length > 0 ? (
						items.map((item, i) => (
							<SelectItem
								className={"text-text cursor-pointer group:hover:bg-green-500"}
								value={typeof item === "string" ? item : item?.value}>
								{typeof item === "string" ? item : item?.label}
							</SelectItem>
						))
					) : (
						<SelectItem value={null}>{noItemMessage}</SelectItem>
					)}
				</SelectContent>
			</Select>
		)
	}
	return (
		<div className={twMerge("z-[20]", containerClassName)}>
			<div className="my-2 flex w-full flex-col gap-2">
				{label && (
					<p className={twMerge("font-heading font-medium text-gray-700 dark:text-gray-500", labelClassName)}>
						{label}
					</p>
				)}
			</div>

			<Selector />
		</div>
	)
}

export default DropdownSelect
