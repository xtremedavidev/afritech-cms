import { useGetSocialLinks } from "@/src/commons/api/footer"
import { twMerge } from "tailwind-merge"
import HomeHeroEditor from "./_component/Hero.component"

interface Props {
	className?: string
}

const FooterPage = ({ className }: Props) => {
	const { data } = useGetSocialLinks()

	return (
		<div className={twMerge("flex w-full flex-col gap-y-4 px-4 pb-10", className)}>
			<div className="mt-4 w-full">
				<p className="font-heading text-2xl font-bold">Footer</p>
				<p className={"text-sm"}>Edit the contents of your website's footer section.</p>
			</div>

			<HomeHeroEditor
				title="Social links"
				subtitle="Edit the social links in the hero section on your website."
				initialData={data}
			/>
		</div>
	)
}

export default FooterPage
