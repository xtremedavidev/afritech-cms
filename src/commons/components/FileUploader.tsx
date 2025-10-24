import { ArrowUpOnSquareIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { FileUploader as Uploader } from "react-drag-drop-files"
import React from "react"
import { twMerge } from "tailwind-merge"
import { DocumentAttachmentIcon } from "hugeicons-react"

interface Props {
	className?: string
	fieldClassName?: string
	files: File[]
	setFiles: (files: File[]) => void
	onFileChange?: (file: File) => void
	maxFiles?: number
	multi?: boolean
	prompt?: string
	allowedFileTypes?: string[]
	hidePromptIcon?: boolean
	disabled?: boolean
}

const FileUploader = (props: Props) => {
	const {
		className,
		fieldClassName,
		files,
		setFiles,
		onFileChange = (file) => {},
		multi = false,
		maxFiles = 3,
		prompt = "Drag or Upload media files",
		allowedFileTypes = ["PNG", "JPG", "JPEG", "SVG", "PDF", "DOCX", "TXT"],
		hidePromptIcon = false,
		disabled,
	} = props

	let fileChangedHandler = (file: File) => {
		setFiles([...files, file])
		onFileChange(file)
	}

	return (
		<div className={twMerge("flex flex-col", className)}>
			{files.length > 0 && (
				<div className="my-4 flex h-[20vh] w-full flex-wrap gap-4">
					{files.map((file, i) =>
						file.type.includes("image") ? (
							<div className={"relative h-full flex-1"}>
								{!disabled && (
									<span
										onClick={() => setFiles(files.filter((f) => f !== file))}
										className="border-dark absolute right-2 top-2 h-6 w-6 cursor-pointer rounded-full border bg-white bg-opacity-70 p-1 drop-shadow-2xl">
										<XMarkIcon className={"text-dark"} />
									</span>
								)}
								<img
									alt={file.name}
									src={URL.createObjectURL(file)}
									className={"bg-primary h-full w-full rounded-xl object-cover"}
								/>
							</div>
						) : (
							<div
								className={
									"bg-primary-dark relative flex aspect-square h-full flex-col items-center justify-center rounded-xl p-4"
								}>
								{!disabled && (
									<span
										onClick={() => setFiles(files.filter((f) => f !== file))}
										className="absolute right-2 top-2 h-6 w-6 cursor-pointer rounded-full bg-white bg-opacity-70 p-1">
										<XMarkIcon className={"text-primary-dark"} />
									</span>
								)}
								<DocumentAttachmentIcon className={"my-2 h-12 w-12 text-gray-400"} />
								<p className={"w-full truncate text-ellipsis text-lg text-gray-400"}>{file.name}</p>
							</div>
						),
					)}
				</div>
			)}
			{((!multi && files.length === 0) || (multi && files.length < maxFiles)) && (
				<Uploader
					disabled={disabled}
					handleChange={fileChangedHandler}
					name="file"
					types={allowedFileTypes}>
					<div className={"w-full"}>
						<label
							className={twMerge(
								"bg-background flex h-[20vh] w-full cursor-pointer appearance-none flex-col items-center justify-center gap-2 overflow-clip rounded-lg border-2 border-dashed border-gray-600 transition hover:border-gray-400 focus:outline-none",
								fieldClassName,
							)}>
							{!hidePromptIcon && <ArrowUpOnSquareIcon className="h-8 w-8 text-gray-500" />}
							<p className="font-heading text-center text-gray-500">{prompt}</p>
							<p className="font-heading text-center text-xs text-gray-500">
								{allowedFileTypes.map(
									(type, i) => `${type}${i + 1 < allowedFileTypes.length ? ", " : ""}`,
								)}
							</p>

							<input
								disabled={disabled}
								type="file"
								name="file_upload"
								className="hidden"
							/>
						</label>
					</div>
				</Uploader>
			)}
		</div>
	)
}

export default FileUploader
