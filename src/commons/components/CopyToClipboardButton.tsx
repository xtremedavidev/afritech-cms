import { toast } from "sonner"
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline"
import React from "react"
import { twMerge } from "tailwind-merge"

interface Props {
	text: string
	className?: string
	onCopy?: () => void
}

const CopyToClipboardButton = ({ text, className, onCopy = () => toast.success("Copied to clipboard") }: Props) => {
	return (
		<div
			onClick={() => {
				navigator.clipboard.writeText(text)
				onCopy()
			}}
			className={twMerge(
				"flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-outline hover:border-primary  dark:hover:border-primary-light",
				className,
			)}>
			<DocumentDuplicateIcon className="h-5 w-5 text-gray-800 dark:text-white" />
		</div>
	)
}

export default CopyToClipboardButton
