import LogoImg from "@assets/images/logo.webp"
import Constants from "@utils/constants"
import { twMerge } from "tailwind-merge"

type Props = {
	className?: string
	icon?: boolean
	iconSize?: number
}

const Logo = ({ className, icon = true, iconSize = 1 }: Props) => {
	return (
		<div className={twMerge("flex w-fit items-center", className)}>
			<img
				style={{
					height: iconSize + 32,
				}}
				className={twMerge("fill-primary", className)}
				src={LogoImg}
			/>

			{!icon && <h1 className={"min-text-lg mx-4 font-bold"}>{Constants.APP_NAME}</h1>}
		</div>
	)
}

export default Logo
