import React, { forwardRef } from "react"
import { useGlobalStore } from "@commons/store"
import CustomText from "@components/CustomText"
import { twMerge } from "tailwind-merge"
import { LoaderIcon } from "lucide-react"

interface Props {
	text?: string
	className?: string
}

function Loading({ className }: Props, ref) {
	const { loadingText } = useGlobalStore()

	return (
		<div
			className={twMerge(
				"absolute z-20 flex h-full min-h-screen w-full items-center justify-center bg-[#000000d2]",
				className,
			)}>
			<Loading.Spinner className={"w-24"} />

			<CustomText
				className={"mt-4 text-white"}
				text={loadingText}
			/>
		</div>
	)
}

const Spinner = ({ className }: Props) => {
	return <LoaderIcon className={twMerge("animate-spin", className)} />
}

const Block = ({
	horizontal,
	className,
	spinnerClassName = "",
	text = "Loading...",
}: Props & {
	horizontal?: boolean
	spinnerClassName?: string
}) => {
	return (
		<div
			className={twMerge(
				`flex h-[20vh] w-full items-center justify-center ${horizontal ? "flex-row" : "flex-col"}`,
				className,
			)}>
			<Loading.Spinner className={spinnerClassName} />
			<CustomText
				className={"my-4"}
				text={text}
			/>
		</div>
	)
}

Loading.Spinner = Spinner
Loading.Block = Block
Loading.Overlay = forwardRef(Loading)

export default Loading
