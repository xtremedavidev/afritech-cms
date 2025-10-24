import { IMetric } from "@/src/commons/api/home/index.interface"
import { HugeIcons } from "@/src/commons/assets/icons"
import CustomButton from "@/src/commons/components/CustomButton"
import FormInput from "@/src/commons/components/FormInput"
import FormTextArea from "@/src/commons/components/FormTextArea"
import { capitalize } from "@/src/commons/utils"

import CONFIG from "@commons/config"
import CustomText from "@components/CustomText"
import DropdownSelect from "@components/DropdownSelect"
import { useRouter } from "@router"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

interface Props {
	title: string
	subtitle?: string
	viewType?: "create" | "edit" | "view"
	initialData?: IMetric
	onSubmit: (options: { data: any; draft: boolean }) => void
	onDelete?: () => void
	isLoading?: boolean
	isDeleting?: boolean
	backUrl?: string
}

export default function MetricEditor({
	title,
	subtitle,
	viewType = "create",
	initialData,
	onSubmit,
	onDelete,
	isLoading = false,
	backUrl = "/home",
}: Props) {
	const router = useRouter()

	const form = useForm(
		CONFIG.useForm({
			schema: (z) => ({
				title: z.string().min(1, "Title is required"),
				value: z.string().min(1, "Metric value is required"),
				description: z.string().min(1, "Metric description is required"),
				order: z.string().min(1, "Metric order is required"),
				status:
					viewType !== "create"
						? z.enum(["published", "draft", "archived"], {
								errorMap: () => ({ message: "Status is required" }),
							})
						: z.string().optional(),
			}),
		}),
	)

	const [files, setFiles] = React.useState<Record<string, File>>({})

	const handleSubmit = form.handleSubmit(
		(data) => {
			onSubmit({ data, draft: false })
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
			onSubmit({ data, draft: true })
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
		form.setValue("value", initialData?.value || "")
		form.setValue("description", initialData?.description || "")
		form.setValue("order", initialData?.order?.toString() || "")
		form.setValue("status", initialData.status || "draft")
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

	return (
		<div className={twMerge("flex w-full flex-col gap-y-4 px-[5%] pb-[5%]")}>
			{/* Editor Section */}
			<div className="flex flex-col">
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

				{viewType === "edit" && (
					<div className={"flex flex-col"}>
						<CustomText
							text={"Change Status"}
							className="font-heading mb-2 text-sm text-gray-700 dark:text-gray-400"
						/>
						<DropdownSelect
							className={"-mt-4 w-full py-1"}
							prompt={"Status"}
							items={["published", "draft"]}
							selected={{
								label: capitalize(form.watch("status")),
								value: form.watch("status"),
							}}
							setSelected={(status) => form.setValue("status", status, { shouldValidate: true })}
						/>
					</div>
				)}
				<FormInput
					className="flex-1"
					errors={form.formState?.errors?.title}
					register={form.register("title")}
					label={"Metric Title"}
					placeholder={"Enter title..."}
					disabled={viewType === "view"}
				/>
				<FormInput
					className="flex-1"
					errors={form.formState?.errors?.title}
					register={form.register("value")}
					label={"Metric value"}
					placeholder={"Enter value..."}
					disabled={viewType === "view"}
				/>

				<FormInput
					className="flex-1"
					errors={form.formState?.errors?.order}
					register={form.register("order")}
					label={"Order"}
					placeholder={"Enter the order of this metric"}
					disabled={viewType === "view"}
				/>

				{/* Description */}
				<FormTextArea
					className="flex-1"
					errors={form.formState?.errors?.description}
					register={form.register("description")}
					label={"Description"}
					placeholder={"Enter metric description..."}
					disabled={viewType === "view"}
				/>
			</div>
		</div>
	)
}
