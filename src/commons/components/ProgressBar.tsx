import React from "react"

interface ProgressBarProps {
	className?: string
	progress: number
}

const ProgressBar = ({ className, progress = 80 }: ProgressBarProps) => {
	return (
		<div className="mt-3 h-1.5 w-full rounded-lg bg-white">
			<div
				className="h-full rounded-md bg-blue-800"
				style={{ width: `${progress}%` }}></div>
		</div>
	)
}

export default ProgressBar
