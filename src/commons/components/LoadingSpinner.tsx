import { twMerge } from "tailwind-merge"
import Logo from "@components/Logo"
import React from "react"

type LoadingSpinnerProps = {
	color?: any
	className?: string
	logo?: boolean
}

function LoadingSpinner({ color = "black", className = "dark:text-white", logo }: LoadingSpinnerProps) {
	if (logo)
		return (
			<div
				className={twMerge(
					`flex aspect-square min-h-0 w-fit min-w-0 flex-col items-center justify-center gap-3 rounded-lg border-2 border-outline bg-background-50 p-10`,
					className,
				)}>
				<Logo
					iconSize={32}
					icon
					className={"animate-pulse"}
				/>
			</div>
		)

	return (
		<>
			<svg
				className={twMerge(`mx-3 h-5 w-5 animate-spin text-${color} ${className}`)}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24">
				<circle
					className="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					strokeWidth="4"></circle>
				<path
					className="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
		</>
	)
}

export default LoadingSpinner
