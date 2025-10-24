import { twMerge } from "tailwind-merge"
import CustomText from "@components/CustomText"
import React, { useEffect } from "react"
import FormInput from "@/src/commons/components/FormInput"
import { useForm } from "react-hook-form"
import CONFIG from "@commons/config"
import { MinimalTiptapEditor } from "@components/ui/minimal-tiptap"
import CustomButton from "@/src/commons/components/CustomButton"
import FileUploader from "@components/FileUploader"
import FormTextArea from "@components/FormTextArea"
import { HugeIcons } from "@/src/commons/assets/icons"
import { TagInput } from "@components/TagInput"
import DropdownSelect from "@components/DropdownSelect"
import { capitalize } from "@utils"
import { useRouter } from "@router"
import { toast } from "sonner"
import ImagePreview from "@components/ImagePreview"

interface Props {
	title: string
	subtitle?: string
	viewType?: "create" | "edit" | "view"
	initialData?: any
	onSubmit: (options: { data: any; files: Record<string, File>; draft: boolean }) => void
	onDelete?: () => void
	isLoading?: boolean
	backUrl?: string
}

export default function BlogEditor({
	title,
	subtitle,
	viewType = "create",
	initialData,
	onSubmit,
	onDelete,
	isLoading = false,
	backUrl = "/blogs",
}: Props) {
	const router = useRouter()

	const form = useForm(
		CONFIG.useForm({
			schema: (z) => ({
				status:
					viewType !== "create"
						? z.enum(["published", "draft", "archived"], {
								errorMap: () => ({ message: "Status is required" }),
							})
						: z.string().optional(),
				title: z.string().min(1, "Title is required"),
				author: z.string().min(1, "Author is required"),
				description: z.string().min(1, "Description is required"),
				body: z.string().min(1, "Content is required"),
				tags: z.array(z.string()).min(1, "At least one tag is required").max(8),
				coverImage: z.string(),
			}),
		}),
	)

	const [files, setFiles] = React.useState<Record<string, File>>({})

	const handleSubmit = form.handleSubmit(
		(data) => {
			onSubmit({ data, files, draft: false })
		},
		(errors) => {
			Object.entries(errors).forEach(([key, value]) => {
				if (value?.message) {
					toast.error(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value.message}`, {
						duration: 4000,
					})
				}
			})
		},
	)

	const handleSaveDraft = form.handleSubmit(
		(data) => {
			onSubmit({ data, files, draft: true })
		},
		(errors) => {
			Object.entries(errors).forEach(([key, value]) => {
				if (value?.message) {
					toast.error(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value.message}`, {
						duration: 4000,
					})
				}
			})
		},
	)

	const handleDelete = () => {
		if (onDelete) onDelete()
	}

	const onFileChanged = (fieldName: string) => (data: File[]) => {
		const file = data?.[0]
		setFiles({ [fieldName]: file })
		const previewUrl = URL.createObjectURL(file)
		form.setValue(fieldName as any, previewUrl)
	}

	useEffect(() => {
		if (!initialData || viewType === "create") return

		// Set form values for edit mode
		form.setValue("title", initialData.title || "")
		form.setValue("description", initialData.description || "")
		form.setValue("body", initialData.body || "")
		form.setValue("status", initialData.status || "draft")
		form.setValue("tags", initialData.tags || [])
		form.setValue("author", initialData.author || "")
		form.setValue("coverImage", initialData.coverImage || "")
	}, [initialData, viewType])

	const renderActionButtons = () => {
		if (viewType === "view") {
			return (
				<div className={"mb-6 flex flex-1 flex-row justify-end gap-x-2"}>
					<CustomButton
						variant={"outlined"}
						onClick={handleDelete}
						className={"mb-3 w-fit rounded-lg border-red-800 dark:border-red-500"}
						text={"Delete"}
						endIcon={<HugeIcons.Delete01Icon />}
					/>
					<CustomButton
						onClick={() => router.push("edit")}
						className={"w-fit rounded-lg"}
						text={"Edit Blog"}
						endIcon={<HugeIcons.FileSyncIcon />}
					/>
				</div>
			)
		}

		if (viewType === "edit") {
			return (
				<div className={"mb-6 flex flex-1 flex-row justify-end gap-x-2"}>
					<CustomButton
						variant={"outlined"}
						onClick={handleDelete}
						className={"mb-3 w-fit rounded-lg border-red-800 dark:border-red-500"}
						text={"Delete"}
						endIcon={<HugeIcons.Delete01Icon />}
					/>
					<CustomButton
						onClick={handleSubmit}
						loading={isLoading}
						className={"w-fit rounded-lg"}
						text={"Update"}
						endIcon={<HugeIcons.FileSyncIcon />}
						disabled={isLoading}
					/>
				</div>
			)
		}

		// Create mode
		return (
			<div className={"mb-6 flex flex-row justify-end gap-x-2"}>
				<CustomButton
					variant={"secondary"}
					onClick={handleSaveDraft}
					className={"mb-3 w-fit rounded-lg"}
					text={"Save Draft"}
					endIcon={<HugeIcons.LicenseDraftIcon />}
					disabled={isLoading}
				/>
				<CustomButton
					onClick={handleSubmit}
					className={"w-fit rounded-lg"}
					text={"Publish"}
					endIcon={<HugeIcons.Upload05Icon />}
					loading={isLoading}
					disabled={isLoading}
				/>
			</div>
		)
	}

	const renderSidebarFields = () => {
		return (
			<>
				{/* Status dropdown - only for edit mode */}
				{viewType === "edit" && (
					<div className={"flex flex-col"}>
						<CustomText
							text={"Change Status"}
							className="font-heading mb-2 text-sm text-gray-700 dark:text-gray-400"
						/>
						<DropdownSelect
							className={"-mt-4 w-[5vw] py-1"}
							prompt={"Status"}
							items={["published", "draft", "archived"]}
							selected={{
								label: capitalize(form.watch("status")),
								value: form.watch("status"),
							}}
							setSelected={(status) => form.setValue("status", status, { shouldValidate: true })}
						/>
					</div>
				)}

				{/* Cover Image Upload */}
				<div className="flex w-full flex-1 flex-col">
					<CustomText
						text={"Cover Image"}
						className="font-heading my-2 mb-3 text-sm text-gray-700 dark:text-gray-400"
					/>

					{files?.coverImage || form.watch("coverImage") ? (
						<ImagePreview
							src={form.watch("coverImage")}
							onCancel={() => {
								setFiles((prev) => {
									const updated = { ...prev }
									delete updated.coverImage
									return updated
								})
								form.setValue("coverImage", "")
							}}
							disabled={viewType === "view"}
						/>
					) : (
						<FileUploader
							className={"md:w-full"}
							fieldClassName={"aspect-square h-[10vh]"}
							files={files?.coverImage ? [files.coverImage] : []}
							prompt={"Drag file here or click to upload"}
							allowedFileTypes={["PNG", "JPG", "JPEG"]}
							setFiles={onFileChanged("coverImage")}
							hidePromptIcon
							disabled={viewType === "view"}
						/>
					)}
				</div>

				{/* Title */}
				<FormInput
					className="flex-1"
					errors={form.formState?.errors?.title}
					register={form.register("title")}
					label={"Title"}
					placeholder={"SEO friendly title..."}
					disabled={viewType === "view"}
				/>

				{/* Description */}
				<FormTextArea
					className="flex-1"
					errors={form.formState?.errors?.description}
					register={form.register("description")}
					label={"Meta Description"}
					placeholder={"Start writing..."}
					disabled={viewType === "view"}
				/>

				{/* Tags */}
				<div className="flex flex-col">
					<CustomText
						text={"Tags"}
						className="font-heading mb-2 text-sm text-gray-700 dark:text-gray-400"
					/>
					<TagInput
						placeholder={"Enter tags and press enter"}
						value={form.watch("tags") || []}
						onChange={(newTags) => form.setValue("tags", newTags, { shouldValidate: true })}
						disabled={viewType === "view"}
					/>
				</div>

				<FormInput
					className="flex-1"
					type={"url"}
					errors={form.formState?.errors?.author}
					register={form.register("author")}
					label={"Author"}
					placeholder={"ex: John Doe"}
					disabled={viewType === "view"}
				/>
			</>
		)
	}

	return (
		<div className={twMerge("flex w-full flex-col gap-y-4 px-[5%] pb-[5%]")}>
			<div className={"my-6 flex flex-row gap-x-4"}>
				{/* Editor Section */}
				<div className="flex w-[65%] flex-col">
					<div className="mt-4 flex items-center justify-between">
						<div className="flex flex-1 flex-col justify-center">
							<CustomButton
								variant={"text"}
								onClick={() => router.push(backUrl)}
								className={"mb-3 w-fit rounded-lg"}
								text={"Back"}
								startIcon={<HugeIcons.ArrowLeft02Icon />}
							/>
							<CustomText
								className="font-heading mb-2 text-3xl font-bold"
								text={title}
							/>
							{subtitle && (
								<CustomText
									className="my-1 mb-6 text-gray-500"
									text={subtitle}
								/>
							)}
						</div>
					</div>
					<MinimalTiptapEditor
						key={initialData?.id}
						value={form.watch("body")}
						onChange={(value) => form.setValue("body", value as any)}
						className="border-outline h-full w-full rounded-xl border"
						editorContentClassName="p-5"
						output={"html"}
						placeholder="Type your content here..."
						autofocus={true}
						editable={viewType !== "view"}
						editorClassName="focus:outline-none"
					/>
				</div>

				{/* Sidebar Section */}
				<div className="flex w-[35%] flex-col">
					{renderActionButtons()}
					<div className="border-outline flex w-full flex-col gap-y-2 rounded-xl border p-4">
						{renderSidebarFields()}
					</div>
				</div>
			</div>
		</div>
	)
}
