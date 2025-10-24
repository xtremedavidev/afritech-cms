import React from "react"
import { twMerge } from "tailwind-merge"

type Props = {
	className?: string
	show: boolean
	transparent?: boolean
	backdropClassName?: string
	setShow?: React.Dispatch<React.SetStateAction<boolean>>
} & React.PropsWithChildren

const DialogLayout = (props: Props) => {
	const { className = "", children, show, transparent, backdropClassName } = props

	if (show)
		return (
			<div
				className={twMerge(
					`fixed left-0 top-0 z-[5000] flex h-screen w-screen items-center justify-center bg-gray-700 bg-opacity-10 backdrop-blur-sm `,
					backdropClassName,
				)}>
				<div
					className={twMerge(
						`flex min-h-[30%] w-fit min-w-[30%] flex-col justify-center rounded-lg 
                         border-2 border-outline bg-white p-8  ${className} ${
								transparent && `border-0 bg-transparent dark:bg-transparent`
							}`,
					)}>
					{children}
				</div>
			</div>
		)
}

export default DialogLayout
