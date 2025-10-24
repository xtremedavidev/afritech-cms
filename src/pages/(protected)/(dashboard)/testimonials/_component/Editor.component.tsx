import { HugeIcons } from "@/src/commons/assets/icons"
import CustomButton from "@/src/commons/components/CustomButton"
import FormInput from "@/src/commons/components/FormInput"
import CONFIG from "@commons/config"
import CustomText from "@components/CustomText"
import DropdownSelect from "@components/DropdownSelect"
import FileUploader from "@components/FileUploader"
import FormTextArea from "@components/FormTextArea"
import ImagePreview from "@components/ImagePreview"
import { useRouter } from "@router"
import { capitalize } from "@utils"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

interface Props {
	title: string
	subtitle?: string
	viewType?: "create" | "edit" | "view"
	initialData?: ITestimonial
	onSubmit: (options: { data: any; files: Record<string, File>; draft: boolean }) => void
	onDelete?: () => void
	isLoading?: boolean
	backUrl?: string
}

export default function TestimonialEditor({
	title,
	subtitle,
	viewType = "create",
	initialData,
	onSubmit,
	onDelete,
	isLoading = false,
	backUrl = "/testimonials",
}: Props) {
	const router = useRouter()

	const form = useForm(
		CONFIG.useForm({
			schema: (z) => ({
				message: z.string().min(1, "Message is required"),
				username: z.string().min(1, "User name is required"),
				userPosition: z.string().min(1, "User position is required"),
				userImage: z.string(),
				status:
					viewType !== "create"
						? z.enum(["published", "draft", "archived"], {
								errorMap: () => ({ message: "Status is required" }),
							})
						: z.string().optional(),
				testimonialLink: z.string().url().optional(),
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

		form.setValue("message", initialData.message || "")
		form.setValue("username", initialData.username || "")
		form.setValue("userPosition", initialData.userPosition || "")
		form.setValue("status", initialData.status || "draft")
		form.setValue("testimonialLink", initialData.testimonialLink || "")
		form.setValue("userImage", initialData.userImage || null)
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
						text={"Edit Testimonial"}
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
						text={"User image"}
						className="font-heading my-2 mb-3 text-sm text-gray-700 dark:text-gray-400"
					/>
					{files?.userImage || form.watch("userImage") ? (
						<ImagePreview
							src={form.watch("userImage")}
							onCancel={() => {
								setFiles((prev) => {
									const updated = { ...prev }
									delete updated.userImage
									return updated
								})
								form.setValue("userImage", "")
							}}
							disabled={viewType === "view"}
						/>
					) : (
						<FileUploader
							className={"md:w-full"}
							fieldClassName={"aspect-square h-[10vh]"}
							files={files?.userImage ? [files.userImage] : []}
							prompt={"Drag file here or click to upload"}
							allowedFileTypes={["PNG", "JPG", "JPEG"]}
							setFiles={onFileChanged("userImage")}
							hidePromptIcon
							disabled={viewType === "view"}
						/>
					)}
				</div>

				{/* Title */}
				<FormInput
					className="flex-1"
					errors={form.formState?.errors?.username}
					register={form.register("username")}
					label={"User name"}
					placeholder={"The testifying user's name"}
					disabled={viewType === "view"}
				/>

				<FormInput
					className="flex-1"
					errors={form.formState?.errors?.userPosition}
					register={form.register("userPosition")}
					label={"User position"}
					placeholder={"The testifying user's position"}
					disabled={viewType === "view"}
				/>

				{/* Description */}
				<FormTextArea
					className="flex-1"
					errors={form.formState?.errors?.message}
					register={form.register("message")}
					label={"Message"}
					placeholder={"Start writing..."}
					disabled={viewType === "view"}
				/>

				<FormInput
					className="flex-1"
					type={"url"}
					errors={form.formState?.errors?.testimonialLink}
					register={form.register("testimonialLink")}
					label={"Testimonial Link"}
					placeholder={"ex: https://x.com/"}
					disabled={viewType === "view"}
				/>
			</>
		)
	}

	return (
		<div className={twMerge("flex w-full flex-col gap-y-4 px-[5%] pb-[5%]")}>
			<div className={"my-6"}>
				{/* Editor Section */}
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
					{renderActionButtons()}
				</div>

				<div className="border-outline mx-auto flex w-full max-w-4xl flex-col gap-y-2 rounded-xl border p-4">
					{renderSidebarFields()}
				</div>
			</div>
		</div>
	)
}
