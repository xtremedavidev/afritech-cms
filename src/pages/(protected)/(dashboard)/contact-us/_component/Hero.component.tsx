import { IAboutHero } from "@/src/commons/api/about-us/index.interface"
import { HugeIcons } from "@/src/commons/assets/icons"
import CustomButton from "@/src/commons/components/CustomButton"
import FormInput from "@/src/commons/components/FormInput"
import CONFIG from "@commons/config"
import CustomText from "@components/CustomText"
import FormTextArea from "@components/FormTextArea"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

interface Props {
	title: string
	subtitle?: string
	viewType?: "create" | "edit" | "view"
	initialData?: IAboutHero
	onSubmit: (options: { data: Partial<IAboutHero> }) => void
	isLoading?: boolean
}

export default function ContactHeroEditor({ title, subtitle, initialData, onSubmit, isLoading = false }: Props) {
	const form = useForm(
		CONFIG.useForm({
			schema: (z) => ({
				sectionTitle: z.string().min(1, "Section title is required"),
				sectionSubtitle: z.string().min(1, "Section subtitle is required"),
				description: z.string().min(1, "Description is required"),
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
	useEffect(() => {
		if (!initialData) return

		form.setValue("sectionTitle", initialData.sectionTitle || "")
		form.setValue("sectionSubtitle", initialData.sectionSubtitle || "")
		form.setValue("description", initialData.description || "")
	}, [initialData])

	const renderSidebarFields = () => {
		return (
			<>
				{/* Title */}
				<FormInput
					className="flex-1"
					errors={form.formState?.errors?.sectionTitle}
					register={form.register("sectionTitle")}
					label={"Section title"}
					placeholder={"Enter section title"}
					disabled={false}
				/>
				<FormInput
					className="flex-1"
					errors={form.formState?.errors?.sectionSubtitle}
					register={form.register("sectionSubtitle")}
					label={"Section subtitle"}
					placeholder={"Enter section title"}
					disabled={false}
				/>

				{/* Description */}
				<FormTextArea
					className="flex-1"
					errors={form.formState?.errors?.description}
					register={form.register("description")}
					label={"Description"}
					placeholder={"Enter section description..."}
					disabled={false}
				/>
			</>
		)
	}

	return (
		<div className={twMerge("flex w-full flex-col gap-y-4")}>
			<div className={""}>
				{/* Editor Section */}
				<div className="mt-4 flex flex-1 flex-col justify-center">
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

				<div className="border-outline mx-auto flex w-full max-w-4xl flex-col gap-y-2 rounded-xl border p-4">
					{renderSidebarFields()}
					<CustomButton
						onClick={handleSubmit}
						loading={isLoading}
						className={"w-fit rounded-lg"}
						text={"Update"}
						endIcon={<HugeIcons.FileSyncIcon />}
						disabled={isLoading}
					/>
				</div>
			</div>
		</div>
	)
}
