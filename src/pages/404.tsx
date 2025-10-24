import Link from "@router/link"
import CustomText from "@components/CustomText"

interface Page404Props {
	className?: string
}

const Page404 = ({ className }: Page404Props) => {
	return (
		<div className=" relative flex h-screen w-full flex-col items-center justify-center transition duration-300 dark:text-white">
			<CustomText className="my-2 text-[5rem]">️🔭</CustomText>
			<CustomText className="my-6 font-heading  text-3xl font-bold">We like us an explorer but..</CustomText>
			<CustomText className="text-md">It seems like you got lost this time.</CustomText>
			<Link
				href="/dashboard"
				className="text-md my-1 text-secondary">
				Don't worry, Here is an easy way home
			</Link>

			<CustomText className="text-md absolute bottom-16 text-gray-500 ">
				404 ERROR: Requested page not found.
			</CustomText>
		</div>
	)
}

export default Page404
