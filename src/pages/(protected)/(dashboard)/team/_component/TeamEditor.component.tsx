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
import KeyValueInput from "@components/KeyValueInput"
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

export default function TeamEditor({
	title,
	subtitle,
	viewType = "create",
	initialData,
	onSubmit,
	onDelete,
	isLoading = false,
	backUrl = "/team",
}: Props) {
	const router = useRouter()

	const form = useForm(
		CONFIG.useForm({
			schema: (z) => ({
				isActive: z.boolean().optional().default(true),
				fullName: z.string().min(1, "Full name is required"),
				tools: z.array(z.string()).min(1, "At least one tool is required"),
				profileImage: z.string().optional(),
				roleTitle: z.string().min(1, "Role title is required"),
				roleDescription: z.string().min(1, "Role description is required"),
				phone: z.string().optional(),
				email: z.string().email("Invalid email").optional(),
				address: z.string().optional(),
				bio: z.string().min(1, "Bio is required"),
				socials: z
					.array(
						z.object({
							name: z.string().min(1, "Social name is required"),
							url: z.string().url("Invalid URL"),
						}),
					)
					.min(1, "At least one social is required"),
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

		form.setValue("fullName", initialData?.fullName || "")
		form.setValue("tools", initialData?.tools || [])
		form.setValue("profileImage", initialData?.profileImage || null)
		form.setValue("roleTitle", initialData?.roleTitle || "")
		form.setValue("roleDescription", initialData?.roleDescription || "")
		form.setValue("phone", initialData?.phone || "")
		form.setValue("email", initialData?.email || "")
		form.setValue("address", initialData?.address || "")
		form.setValue("bio", initialData?.bio || "")
		form.setValue("socials", initialData?.socials || [])
		form.setValue("isActive", initialData?.isActive ?? true)


	}, [initialData, viewType])

	const renderActionButtons = () => {
		if (viewType === "view") {
			return (
				<div className="mb-6 flex flex-row justify-end gap-x-2">
					<CustomButton
						variant="outlined"
						onClick={handleDelete}
						className="mb-3 w-fit rounded-lg border-red-800 dark:border-red-500"
						text="Delete"
						endIcon={<HugeIcons.Delete01Icon />}
					/>
					<CustomButton
						onClick={() => router.push("edit")}
						className="w-fit rounded-lg"
						text="Edit Team"
						endIcon={<HugeIcons.FileSyncIcon />}
					/>
				</div>
			)
		}

		if (viewType === "edit") {
			return (
				<div className="mb-6 flex flex-row justify-end gap-x-2">
					<CustomButton
						variant="outlined"
						onClick={handleDelete}
						className="mb-3 w-fit rounded-lg border-red-800 dark:border-red-500"
						text="Delete"
						endIcon={<HugeIcons.Delete01Icon />}
					/>
					<CustomButton
						onClick={handleSubmit}
						loading={isLoading}
						className="w-fit rounded-lg"
						text="Update"
						endIcon={<HugeIcons.FileSyncIcon />}
						disabled={isLoading}
					/>
				</div>
			)
		}

		return (
			<div className="mb-6 flex flex-row justify-end gap-x-2">
				<CustomButton
					variant="secondary"
					onClick={handleSaveDraft}
					className="mb-3 w-fit rounded-lg"
					text="Save Draft"
					endIcon={<HugeIcons.LicenseDraftIcon />}
					disabled={isLoading}
				/>
				<CustomButton
					onClick={handleSubmit}
					className="w-fit rounded-lg"
					text="Publish"
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
				{viewType === "edit" && (
					<div className="flex flex-col">
						<CustomText
							text="Change Status"
							className="font-heading mb-2 text-sm text-gray-700 dark:text-gray-400"
						/>
						<DropdownSelect
							className="-mt-4 w-[5vw] py-1"
							prompt="Status"
							items={["inactive", "active"]}
							selected={{
								label: form.watch("isActive") ? "Active" : "Inactive",
								value: form.watch("isActive") ? "active" : "inactive",
							}}
							setSelected={(status) => {
								form.setValue("isActive", status.value === "active", { shouldValidate: true })
							}}
						/>
					</div>
				)}
			</>
		)
	}

	return (
		<div className={twMerge("flex w-full flex-col gap-y-4 px-[5%] pb-[5%]")}>
			<div className="my-6 flex flex-row gap-x-4">
				{/* Editor Section */}
				<div className="flex w-[65%] flex-col">
					<div className="mt-4 flex items-center justify-between">
						<div className="flex flex-1 flex-col justify-center">
							<CustomButton
								variant="text"
								onClick={() => router.push(backUrl)}
								className="mb-3 w-fit rounded-lg"
								text="Back"
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

					{/* Profile Image Upload */}
					<div className="mb-5 flex w-full flex-1 flex-col">
						<CustomText
							text="Profile Image"
							className="font-heading my-2 mb-3 text-sm text-gray-700 dark:text-gray-400"
						/>
						{files?.profileImage || form.watch("profileImage") ? (
							<ImagePreview
								src={form.watch("profileImage")}
								onCancel={() => {
									setFiles((prev) => {
										const updated = { ...prev }
										delete updated.profileImage
										return updated
									})
									form.setValue("profileImage", "")
								}}
								disabled={viewType === "view"}
							/>
						) : (
							<FileUploader
								className={"md:w-full"}
								fieldClassName={"aspect-square h-[10vh]"}
								files={files?.profileImage ? [files.profileImage] : []}
								prompt={"Drag file here or click to upload"}
								allowedFileTypes={["PNG", "JPG", "JPEG"]}
								setFiles={onFileChanged("profileImage")}
								hidePromptIcon
								disabled={viewType === "view"}
							/>
						)}
					</div>

					<FormInput
						containerClassName="mt-4"
						errors={form.formState?.errors?.fullName}
						register={form.register("fullName")}
						label="Full Name"
						placeholder="e.g John Doe."
						disabled={viewType === "view"}
					/>

					<FormInput
						containerClassName="mt-4"
						errors={form.formState?.errors?.roleTitle}
						register={form.register("roleTitle")}
						label="Role Title"
						placeholder="e.g Software Engineer"
						disabled={viewType === "view"}
					/>

					<FormTextArea
						containerClassName="h-32 mt-4"
						errors={form.formState?.errors?.roleDescription}
						register={form.register("roleDescription")}
						label="Role Description"
						placeholder="Enter role description..."
						disabled={viewType === "view"}
					/>

					<FormTextArea
						containerClassName="h-32 mt-4"
						errors={form.formState?.errors?.bio}
						register={form.register("bio")}
						label="Bio"
						placeholder="Enter biography..."
						disabled={viewType === "view"}
					/>

					<FormTextArea
						containerClassName="h-32 mt-4"
						errors={form.formState?.errors?.address}
						register={form.register("address")}
						label="Address"
						placeholder="Enter address..."
						disabled={viewType === "view"}
					/>

					<FormInput
						containerClassName="mt-4"
						errors={form.formState?.errors?.email}
						register={form.register("email")}
						label="Email Address"
						placeholder="Enter email address..."
						disabled={viewType === "view"}
					/>

					<FormInput
						containerClassName="mt-4"
						errors={form.formState?.errors?.phone}
						register={form.register("phone")}
						label="Phone Number"
						placeholder="Enter phone..."
						disabled={viewType === "view"}
					/>
				</div>

				{/* Sidebar Section */}
				<div className="flex w-[35%] flex-col items-start">
					{renderActionButtons()}
					<div className="flex w-full flex-col gap-y-4 rounded-xl p-4">
						<div className="bg-background-50 rounded-xl p-4">{renderSidebarFields()}</div>

						<div className="bg-background-50 rounded-xl p-4">
							<div className="flex flex-col">
								<CustomText
									text="Tools Used"
									className="font-heading mb-2 text-sm text-gray-700 dark:text-gray-400"
								/>
								<TagInput
									value={form.watch("tools") || []}
									onChange={(newTags) => form.setValue("tools", newTags, { shouldValidate: true })}
									disabled={viewType === "view"}
								/>
							</div>
						</div>

						<div className="bg-background-50 rounded-xl p-4">
							<div className="flex flex-col">
								<CustomText
									text="Social Links"
									className="font-heading mb-2 text-sm text-gray-700 dark:text-gray-400"
								/>
								{/* Could be a repeatable input, using TagInput for now */}
								<KeyValueInput
									value={form.watch("socials")?.map(x=>({
										key: x.name,
										value: x.url,
									})) || []}
									onChange={(newSocials) =>
										form.setValue("socials", newSocials?.map((x)=>({
											name: x.key,
											url: x.value,
										})), { shouldValidate: true })
									}
									disabled={viewType === "view"}
									label="Social Links"
									placeholder={{
										key: "Social name",
										value: "Platform URL",
									}}
									defaultItems={[
										{
											key: "instagram",
											label: "Instagram",
											placeholder: "https://instagram.com/username",
										},
										{
											key: "linkedin",
											label: "LinkedIn",
											placeholder: "https://linkedin.com/in/username",
										},
										{
											key: "github",
											label: "Github",
											placeholder: "https://github.com/username",
										},
									]}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
