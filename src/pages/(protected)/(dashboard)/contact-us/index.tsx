import { IAboutHero } from "@/src/commons/api/about-us/index.interface"
import {
	useGetContactEmail,
	useGetContactHero,
	useUpdateContactEmail,
	useUpdateContactHero,
} from "@/src/commons/api/contact-us"
import { IContactReceiverEmail } from "@/src/commons/api/contact-us/index.interface"
import { useGlobalStore } from "@/src/commons/store"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"
import ContactEmailEditor from "./_component/Contact-History.component"
import HeroEditor from "./_component/Hero.component"

interface Props {
	className?: string
	search?: string
	startDate?: string
	endDate?: string
	limit?: number
	sortBy?: string
	sortOrder?: "DESC" | "ASC"
}

const ContactUsPage = ({ className }: Props) => {
	const { data: contactHero } = useGetContactHero()
	const { data: aboutContent } = useGetContactEmail()
	const { mutateAsync: updateHero, isPending: isUpdating } = useUpdateContactHero()
	const { mutateAsync: updateContactEmail, isPending: isUpdatingContent } = useUpdateContactEmail()

	const { loader } = useGlobalStore()

	const onSubmit = ({ data }: { data: IAboutHero }) => {
		loader.start()
		updateHero(data)
			.then((res) => toast.success("Contact us hero section updated!"))
			.finally(() => loader.reset())
	}

	const onUpdateContent = ({ data }: { data: IContactReceiverEmail }) => {
		loader.start()
		updateContactEmail(data)
			.then((res) => toast.success("Contact email updated!"))
			.finally(() => loader.reset())
	}

	return (
		<div className={twMerge("flex w-full flex-col gap-y-4 px-4 pb-[5%]", className)}>
			<HeroEditor
				title="Contact us"
				subtitle="Edit the contact us section on your website."
				viewType="create"
				initialData={contactHero}
				onSubmit={onSubmit}
				isLoading={isUpdating}
			/>
			<ContactEmailEditor
				title="Receiver email"
				subtitle="Edit the receiver email to receive contact messages from users on your website"
				initialData={aboutContent}
				onSubmit={onUpdateContent}
				isLoading={isUpdatingContent}
			/>
		</div>
	)
}

export default ContactUsPage
