import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@utils"
import { Calendar } from "@components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover"
import { Button } from "@components/ui/button"
import { twMerge } from "tailwind-merge"

interface Props {
	className?: string
	date: Date
	setDate: (date: Date) => void
	prompt?: string
	buttonClassName?: string
}

export function DatePicker({ date, setDate, prompt = "Pick a date", className, buttonClassName }: Props) {
	return (
		<div className={twMerge("", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={"outline"}
						className={cn(
							"w-[280px] justify-start rounded-full text-left font-normal",
							!date && "text-muted-foreground",
							buttonClassName,
						)}>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date ? format(date, "PPP") : <span>{prompt}</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="z-[2000] w-auto p-0">
					<Calendar
						mode="single"
						selected={date}
						onSelect={setDate}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}
