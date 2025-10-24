import { HugeIcons } from "@/src/commons/assets/icons"
import CustomButton from "@/src/commons/components/CustomButton"
import FormInput from "@/src/commons/components/FormInput"
import CONFIG from "@commons/config"
import CustomText from "@components/CustomText"
import FormTextArea from "@components/FormTextArea"
import { useRouter } from "@router"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

interface Props {
	title: string
	subtitle?: string
	viewType?: "create" | "edit" | "view"
	initialData?: any
	onSubmit: (options: { data: any }) => void
	onDelete?: () => void
	isLoading?: boolean
	isDeleting?: boolean
	backUrl?: string
}

export default function ProcessEditor({
	title,
	subtitle,
	viewType = "create",
	initialData,
	onSubmit,
	onDelete,
	isLoading = false,
	isDeleting,
	backUrl = "/our-process",
}: Props) {
	const router = useRouter()

	const form = useForm(
		CONFIG.useForm({
			schema: (z) => ({
				processTitle: z.string().min(1, "Process title is required"),
				description: z.string().min(1, "Process description is required"),
				order: z.string().min(1, "Process order is required"),
				startDate: z.date().optional(),
				endDate: z.date().optional(),
			}),
		}),
	)

	const handleSubmit = form.handleSubmit(
		(data) => {
			onSubmit({ data })
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

	useEffect(() => {
		if (!initialData || viewType === "create") return

		// Set form values for edit mode
		if (initialData.startDate) form.setValue("startDate", new Date(initialData.startDate))
		if (initialData.endDate) form.setValue("endDate", new Date(initialData.endDate))
		form.setValue("processTitle", initialData.processTitle || "")
		form.setValue("description", initialData.description || "")
		form.setValue("order", initialData.order?.toString() || "")
	}, [initialData, viewType])

	const renderActionButtons = () => {
		if (viewType === "view") {
			return (
				<div className={"mb-6 flex flex-1 flex-row justify-end gap-x-2"}>
					<CustomButton
						variant={"outlined"}
						onClick={handleDelete}
						loading={isDeleting}
						className={"mb-3 w-fit rounded-lg border-red-800 dark:border-red-500"}
						text={"Delete"}
						endIcon={<HugeIcons.Delete01Icon />}
					/>
					<CustomButton
						onClick={() => router.push("edit")}
						className={"w-fit rounded-lg"}
						text={"Edit Process"}
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
						loading={isDeleting}
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
					</div>
				)}

				{/* Title */}
				<FormInput
					className="flex-1"
					errors={form.formState?.errors?.processTitle}
					register={form.register("processTitle")}
					label={"Process title"}
					placeholder={"Enter process title"}
					disabled={viewType === "view"}
				/>
				<FormInput
					className="flex-1"
					errors={form.formState?.errors?.order}
					register={form.register("order")}
					label={"Order"}
					placeholder={"Enter the order of this process item"}
					disabled={viewType === "view"}
				/>

				{/* Description */}
				<FormTextArea
					className="flex-1"
					errors={form.formState?.errors?.description}
					register={form.register("description")}
					label={"Description"}
					placeholder={"Enter process description..."}
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
