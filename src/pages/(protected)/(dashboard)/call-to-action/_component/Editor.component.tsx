import { useUpdateCTA } from "@/src/commons/api/call-to-action"
import { HugeIcons } from "@/src/commons/assets/icons"
import CustomButton from "@/src/commons/components/CustomButton"
import FormInput from "@/src/commons/components/FormInput"
import { useGlobalStore } from "@/src/commons/store"
import CONFIG from "@commons/config"
import CustomText from "@components/CustomText"
import FormTextArea from "@components/FormTextArea"
import { useParams } from "@router"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

interface Props {
	title: string
	subtitle?: string
	viewType?: "create" | "edit" | "view"
	initialData?: any
}

export default function CallToActionEditor({ title, subtitle, viewType = "create", initialData }: Props) {
	const { id } = useParams()
	const { loader } = useGlobalStore()

	const { mutateAsync: updateCTA, isPending: isUpdating } = useUpdateCTA(id)

	const form = useForm(
		CONFIG.useForm({
			schema: (z) => ({
				title: z.string().min(1, "Title is required"),
				description: z.string().min(1, "Description is required"),
				startDate: z.date().optional(),
				endDate: z.date().optional(),
			}),
		}),
	)

	const handleSubmit = form.handleSubmit(
		(data) => {
			loader.start()

			updateCTA({ 
				title: data.title || "", 
				description: data.description || "", 
				status: "published" 
			})
				.then((res) => toast.success("Call to action updated!"))
				.finally(() => loader.reset())
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

	useEffect(() => {
		if (!initialData) return

		form.setValue("title", initialData.title || "")
		form.setValue("description", initialData.description || "")
	}, [initialData, viewType])

	const renderSidebarFields = () => {
		return (
			<>
				{/* Title */}
				<FormInput
					className="flex-1"
					errors={form.formState?.errors?.title}
					register={form.register("title")}
					label={"Title"}
					placeholder={"Enter call to action title"}
					disabled={viewType === "view"}
				/>

				{/* Description */}
				<FormTextArea
					className="flex-1"
					errors={form.formState?.errors?.description}
					register={form.register("description")}
					label={"Description"}
					placeholder={"Enter call to action description..."}
					disabled={viewType === "view"}
				/>
			</>
		)
	}

	return (
		<div className={twMerge("flex w-full flex-col gap-y-4")}>
			<div className={""}>
				{/* Editor Section */}
				<div className="mt-4 flex items-center justify-between">
					<div className="flex flex-1 flex-col justify-center">
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
					<div className={"mb-6 flex flex-1 flex-row justify-end gap-x-2"}>
						<CustomButton
							onClick={handleSubmit}
							loading={isUpdating}
							className={"w-fit rounded-lg"}
							text={"Update"}
							endIcon={<HugeIcons.FileSyncIcon />}
							disabled={isUpdating}
						/>
					</div>
				</div>

				<div className="border-outline mx-auto flex w-full max-w-4xl flex-col gap-y-2 rounded-xl border p-4">
					{renderSidebarFields()}
				</div>
			</div>
		</div>
	)
}
