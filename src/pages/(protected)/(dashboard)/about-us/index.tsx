import { useGetAboutContent, useGetAboutHero, useUpdateAboutHero } from "@/src/commons/api/about-us"
import { IAboutContent, IAboutHero } from "@/src/commons/api/about-us/index.interface"
import { useGlobalStore } from "@/src/commons/store"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"
import AboutHistoryEditor from "./_component/About-History.component"
import HeroEditor from "./_component/Hero.component"

interface Props {
	className?: string
}

const AboutUsPage = ({ className }: Props) => {
	const { data: aboutHero } = useGetAboutHero()
	const { data: aboutContent } = useGetAboutContent()
	const { mutateAsync: updateHero, isPending: isUpdating } = useUpdateAboutHero()
	const { mutateAsync: updateContent, isPending: isUpdatingContent } = useUpdateAboutHero()

	const { loader } = useGlobalStore()

	const onSubmit = ({ data }: { data: IAboutHero }) => {
		loader.start()
		updateHero(data)
			.then((res) => toast.success("About us hero section updated!"))
			.finally(() => loader.reset())
	}

	const onUpdateContent = ({ data }: { data: IAboutContent }) => {
		loader.start()
		updateContent(data)
			.then((res) => toast.success("About us content updated!"))
			.finally(() => loader.reset())
	}

	return (
		<div className={twMerge("flex w-full flex-col gap-y-4 px-4 pb-[5%]", className)}>
			<HeroEditor
				title="About us"
				subtitle="Edit the about us section on your website."
				viewType="create"
				initialData={aboutHero}
				onSubmit={onSubmit}
				isLoading={isUpdating}
			/>
			<AboutHistoryEditor
				title="About Afritech54"
				subtitle="Edit the about us history on your website."
				initialData={aboutContent}
				onSubmit={onUpdateContent}
				isLoading={isUpdatingContent}
			/>
		</div>
	)
}

export default AboutUsPage
