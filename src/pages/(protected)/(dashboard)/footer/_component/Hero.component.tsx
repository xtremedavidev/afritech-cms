import { useUpdateSocialLink } from "@/src/commons/api/footer"
import { IFooterLinks } from "@/src/commons/api/footer/index.interface"
import { HugeIcons } from "@/src/commons/assets/icons"
import CustomButton from "@/src/commons/components/CustomButton"
import FormInput from "@/src/commons/components/FormInput"
import { useGlobalStore } from "@/src/commons/store"
import CONFIG from "@commons/config"
import CustomText from "@components/CustomText"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

interface Props {
	title: string
	subtitle?: string
	initialData?: IFooterLinks
}

export default function FooterLinksEditor({ title, subtitle, initialData }: Props) {
	const { loader } = useGlobalStore()
	const { mutateAsync, isPending: isUpdating } = useUpdateSocialLink()

	const onSubmit = ({ data }: { data: Partial<IFooterLinks> }) => {
		loader.start()
		mutateAsync(data)
			.then((res) => toast.success("Footer link(s) updated!"))
			.finally(() => loader.reset())
	}
	const form = useForm(
		CONFIG.useForm({
			schema: (z) => ({
				instagramLink: z.string().min(1, "Instagram link is required"),
				facebookLink: z.string().min(1, "Facebook link is required"),
				linkedInLink: z.string().min(1, "Linkedin link is required"),
				behanceLink: z.string().min(1, "Behance link is required"),
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

		form.setValue("instagramLink", initialData.instagramLink || "")
		form.setValue("facebookLink", initialData.facebookLink || "")
		form.setValue("linkedInLink", initialData.linkedInLink || "")
		form.setValue("behanceLink", initialData.behanceLink || "")
	}, [initialData])

	const renderSidebarFields = () => {
		return (
			<>
				{/* Title */}
				<FormInput
					className="flex-1"
					errors={form.formState?.errors?.instagramLink}
					register={form.register("instagramLink")}
					label={"Instagram link"}
					placeholder={"Enter instagram URL"}
					disabled={false}
				/>
				<FormInput
					className="flex-1"
					errors={form.formState?.errors?.facebookLink}
					register={form.register("facebookLink")}
					label={"Facebook link"}
					placeholder={"Enter facebook URL"}
					disabled={false}
				/>
				<FormInput
					className="flex-1"
					errors={form.formState?.errors?.linkedInLink}
					register={form.register("linkedInLink")}
					label={"Linkedin link"}
					placeholder={"Enter linkedin URL"}
					disabled={false}
				/>
				<FormInput
					className="flex-1"
					errors={form.formState?.errors?.behanceLink}
					register={form.register("behanceLink")}
					label={"Behance link"}
					placeholder={"Enter behance URL"}
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
						className="font-heading text-2xl font-bold"
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
						loading={isUpdating}
						className={"w-fit rounded-lg"}
						text={"Update"}
						endIcon={<HugeIcons.FileSyncIcon />}
						disabled={isUpdating}
					/>
				</div>
			</div>
		</div>
	)
}
