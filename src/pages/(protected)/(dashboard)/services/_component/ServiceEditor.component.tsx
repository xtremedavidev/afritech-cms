import { twMerge } from "tailwind-merge"
import CustomText from "@components/CustomText"
import React, { useEffect } from "react"
import FormInput from "@/src/commons/components/FormInput"
import { useForm } from "react-hook-form"
import CONFIG from "@commons/config"
import CustomButton from "@/src/commons/components/CustomButton"
import FileUploader from "@components/FileUploader"
import FormTextArea from "@components/FormTextArea"
import { HugeIcons } from "@/src/commons/assets/icons"
import { TagInput } from "@components/TagInput"
import DropdownSelect from "@components/DropdownSelect"
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

export default function ServiceEditor({
	title,
	subtitle,
	viewType = "create",
	initialData,
	onSubmit,
	onDelete,
	isLoading = false,
	backUrl = "/services",
}: Props) {
	const router = useRouter()

	const form = useForm(
		CONFIG.useForm({
			schema: (z) => ({
				title: z.string().min(1, "Title is required"),
				description: z.string().min(1, "Description is required"),
				tools: z.array(z.string()).min(1, "At least one tool is required"),
				seo: z.object({
					title: z.string().min(1, "SEO title is required").optional(),
					description: z.string().min(1, "SEO description is required").optional(),
					tags: z.array(z.string()).min(1, "At least one tool is required"),
				}),
				coverImage: z.string(),
				supportImage: z.string(),
				price: z.coerce.number().nonnegative("Price must be positive").optional(),
				discountPrice: z.coerce.number().nonnegative("Discount price must be positive").optional(),
				discountPercentage: z
					.number()
					.min(0, "Discount percentage cannot be less than 0")
					.max(100, "Discount percentage cannot be more than 100")
					.optional(),
				isActive: z.boolean().default(true),
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

		form.setValue("title", initialData?.title || "")
		form.setValue("description", initialData?.description || "")
		form.setValue("tools", initialData?.tools || [])
		form.setValue("seo.title", initialData?.seo?.title || "")
		form.setValue("seo.description", initialData?.seo?.description || "")
		form.setValue("seo.tags", initialData?.seo?.tags || [])
		form.setValue("coverImage", initialData?.coverImage || null)
		form.setValue("supportImage", initialData?.supportImage || null)
		form.setValue("price", initialData?.price || 0)
		form.setValue("discountPrice", initialData?.discountPrice || 0)
		form.setValue("discountPercentage", initialData?.discountPercentage || 0)
		form.setValue("isActive", initialData?.isActive || false)
	}, [initialData, viewType])

	const renderActionButtons = () => {
		if (viewType === "view") {
			return (
				<div className={"mb-6 flex flex-row justify-end gap-x-2"}>
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
						text={"Edit Service"}
						endIcon={<HugeIcons.FileSyncIcon />}
					/>
				</div>
			)
		}

		if (viewType === "edit") {
			return (
				<div className={"mb-6 flex flex-row justify-end gap-x-2"}>
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
							items={["inactive", "active"]}
							selected={{
								label: form.watch("isActive") ? "Active" : "Inactive",
								value: form.watch("isActive") ? "active" : "inactive",
							}}
							setSelected={(status) => {
								console.log(status)
								form.setValue("isActive", status === "active", { shouldValidate: true })
							}}
						/>
					</div>
				)}

				{/* Title */}
				<FormInput
					className="flex-1"
					errors={form.formState?.errors?.seo?.title}
					register={form.register("seo.title")}
					label={"SEO Title"}
					placeholder={"SEO friendly title..."}
					disabled={viewType === "view"}
				/>

				{/* Description */}
				<FormTextArea
					className="flex-1"
					errors={form.formState?.errors?.description}
					register={form.register("seo.description")}
					label={"SEO Description"}
					placeholder={"Start writing..."}
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

					<FormInput
						className="flex-1"
						errors={form.formState?.errors?.title}
						register={form.register("title")}
						label={"Service Title"}
						placeholder={"Enter title..."}
						disabled={viewType === "view"}
					/>

					{/* Description */}
					<FormTextArea
						containerClassName={"h-48 mt-4"}
						className="flex-1"
						errors={form.formState?.errors?.description}
						register={form.register("description")}
						label={"Service Description"}
						placeholder={"Enter description..."}
						disabled={viewType === "view"}
					/>

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
								fieldClassName={"aspect-square h-[30vh]"}
								files={files?.coverImage ? [files.coverImage] : []}
								prompt={"Drag file here or click to upload"}
								allowedFileTypes={["PNG", "JPG", "JPEG"]}
								setFiles={onFileChanged("coverImage")}
								hidePromptIcon
								disabled={viewType === "view"}
							/>
						)}
					</div>

					{/* Support Image Upload */}
					<div className="mt-5 flex w-full flex-1 flex-col">
						<CustomText
							text={"Support Image"}
							className="font-heading my-2 mb-3 text-sm text-gray-700 dark:text-gray-400"
						/>

						{files?.supportImage || form.watch("supportImage") ? (
							<ImagePreview
								src={form.watch("supportImage")}
								onCancel={() => {
									setFiles((prev) => {
										const updated = { ...prev }
										delete updated.supportImage
										return updated
									})
									form.setValue("supportImage", "")
								}}
								disabled={viewType === "view"}
							/>
						) : (
							<FileUploader
								className={"md:w-full"}
								fieldClassName={"aspect-square h-[30vh]"}
								files={files?.supportImage ? [files.supportImage] : []}
								prompt={"Drag file here or click to upload"}
								allowedFileTypes={["PNG", "JPG", "JPEG"]}
								setFiles={onFileChanged("supportImage")}
								hidePromptIcon
								disabled={viewType === "view"}
							/>
						)}
					</div>

					<div className="mt-6 flex flex-row gap-x-2">
						<FormInput
							className="flex-1"
							type={"number"}
							errors={form.formState?.errors?.price}
							register={form.register("price")}
							label={"Service Price"}
							placeholder={"Enter price..."}
							disabled={viewType === "view"}
						/>
						<FormInput
							className="flex-1"
							type={"number"}
							errors={form.formState?.errors?.discountPrice}
							register={form.register("discountPrice")}
							label={"Discount Price"}
							placeholder={"Price at discount..."}
							disabled={viewType === "view"}
						/>
					</div>
				</div>

				{/* Sidebar Section */}
				<div className="flex w-[35%] flex-col items-start">
					{renderActionButtons()}
					<div className="flex w-full flex-col gap-y-4 rounded-xl p-4">
						<div className="bg-background-50 rounded-xl p-4">{renderSidebarFields()}</div>

						<div className="bg-background-50 rounded-xl p-4">
							{/* Tags */}
							<div className="flex flex-col">
								<CustomText
									text={"Tags"}
									className="font-heading mb-2 text-sm text-gray-700 dark:text-gray-400"
								/>
								<TagInput
									placeholder={"Enter tags and press enter"}
									value={form.watch("seo.tags") || []}
									onChange={(newTags) => form.setValue("seo.tags", newTags, { shouldValidate: true })}
									disabled={viewType === "view"}
								/>
							</div>
						</div>

						<div className="bg-background-50 rounded-xl p-4">
							<div className="flex flex-col">
								<CustomText
									text={"Tools Used"}
									className="font-heading mb-2 text-sm text-gray-700 dark:text-gray-400"
								/>
								<TagInput
									value={form.watch("tools") || []}
									onChange={(newTags) => form.setValue("tools", newTags, { shouldValidate: true })}
									disabled={viewType === "view"}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
