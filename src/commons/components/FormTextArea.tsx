import { twMerge } from "tailwind-merge"
import React, { useState } from "react"
import { textFieldStyle } from "@components/FormInput"
import { FieldError } from "react-hook-form"

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string
	className?: string
	register?: any
	errors?: FieldError | any
	variant?: "primary" | "secondary"
	description?: string
	containerClassName?: string
}

const FormTextArea = (props: Props) => {
	const {
		className = "",
		label,
		register,
		description,
		maxLength,
		errors = {},
		onChange,
		containerClassName,
		variant,
	} = props

	const textFieldClass = `${textFieldStyle} ${Object.keys(errors)?.length > 0 ? "border-red-400 ring-red-400" : ""} font-heading dark:text-white h-32`
	const [value, setValue] = useState("")

	const variance = {
		primary: "",
		secondary: "py-4 rounded-lg",
	}[variant]

	const setup = {
		...props,
		...register,
		onChange: (e) => {
			setValue(e.target?.value)
			onChange && onChange(e)
		},
		className: twMerge(textFieldClass, `placeholder:text-gray-400`, variance, className),
	}

	return (
		<div className={twMerge("flex w-full flex-col", containerClassName)}>
			{label && (
				<div className="my-1 flex gap-2">
					<p className="font-heading text-gray-700 dark:text-gray-400">{label}</p>
					{description && <em className="font-heading text-gray-500 dark:text-gray-700">(*{description})</em>}
				</div>
			)}
			<textarea {...setup} />
			<div className="my-2 flex items-center justify-between">
				<p className={"w-full text-red-400"}>{Object.keys(errors)?.length > 0 && errors.message}</p>

				{maxLength && (
					<p className={"text-xs text-gray-400"}>
						{value.length}/{maxLength}
					</p>
				)}
			</div>
		</div>
	)
}

export default FormTextArea
