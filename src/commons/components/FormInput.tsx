import { twMerge } from "tailwind-merge"
import React, { useState } from "react"
import { ViewIcon, ViewOffIcon } from "hugeicons-react"

type FormInputProps = React.ComponentProps<"input"> & {
	className?: string
	register?: any
	startIcon?: any
	endIcon?: any
	iconClick?: any
	label?: any
	description?: string
	startIconClassName?: string
	endIconClassName?: string
	embeddedComponent?: React.ReactNode
	errors?: any
	variant?: "primary" | "floating"
	containerClassName?: string
}

export const textFieldStyle = ` my-1 dark:autofill:bg-gray-900 autofill:bg-gray-500 p-4 outline-0 focus:ring-1 border border-input ring-primary-light transition-200 rounded-lg w-full`

const FormInput = (props: FormInputProps) => {
	const {
		className = "",
		startIcon,
		endIcon,
		iconClick,
		label,
		register,
		description,
		startIconClassName,
		endIconClassName,
		type,
		errors = {},
		embeddedComponent,
		variant = "primary",
		containerClassName,
		placeholder,
		...rest
	} = props

	const [showPassword, setShowPassword] = useState(false)

	// Original primary variant
	const textFieldClass = `${textFieldStyle} ${Object.keys(errors)?.length > 0 ? "dark:border-red-400 border-red-400 ring-red-400" : ""} font-heading ${startIcon && "pl-12"} ${
		endIcon && "pr-12"
	}`

	const inputClass = twMerge(textFieldClass, className)

	if (variant === "floating") {
		// Use react-floating-label-input for floating variant
		return (
			<div className={twMerge("flex w-full flex-col text-start", containerClassName)}>
				<div className="relative flex w-full items-center">
					{startIcon && (
						<div
							className={twMerge(
								`absolute left-4 z-10 flex h-6 w-6 items-center text-gray-400 ${
									iconClick && "hover:text-primary cursor-pointer"
								} ${startIconClassName}`,
							)}
							onClick={iconClick}>
							{startIcon}
						</div>
					)}

					{/* Battle-tested floating label component wrapper */}
					<div className="relative w-full">
						<input
							type={showPassword ? "text" : type}
							{...rest}
							{...register}
							className={twMerge(
								inputClass,
								"peer w-full  transition-all duration-200 pl-6 pt-6 pb-3",
								startIcon && "pl-12",
								(endIcon || type === "password" || embeddedComponent) && "pr-12",
								Object.keys(errors)?.length > 0 && "border-red-400 ring-red-400",
								className,
							)}
							placeholder=" "
						/>
						<label
							className={twMerge(
								`absolute left-${startIcon ? "12" : "4"} ml-2 mt-0.5 font-heading pointer-events-none top-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-sm peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-sm dark:text-gray-400`,
							)}>
							{placeholder}
						</label>
					</div>

					{embeddedComponent ? (
						<div className="absolute right-1.5 z-10 flex h-fit w-fit items-center text-gray-400 transition">
							{embeddedComponent}
						</div>
					) : type === "password" ? (
						<div
							className="absolute right-4 z-10 flex h-6 w-6 cursor-pointer items-center text-gray-400 transition"
							onClick={() => setShowPassword(!showPassword)}>
							{showPassword ? <ViewIcon /> : <ViewOffIcon />}
						</div>
					) : endIcon ? (
						<div
							className={twMerge(
								`absolute right-4 z-10 flex h-6 w-6 items-center text-gray-400 transition ${
									iconClick && "hover:text-primary cursor-pointer"
								} ${endIconClassName}`,
							)}
							onClick={iconClick}>
							{endIcon}
						</div>
					) : null}
				</div>

				<div className="ml-5">
					{Object.keys(errors)?.length > 0 && errors.message ? (
						<p className="w-full text-sm text-red-400">{errors.message}</p>
					) : description ? (
						<p className="w-full text-sm text-gray-500">{description}</p>
					) : null}
				</div>
			</div>
		)
	}

	return (
		<div className={twMerge("flex w-full flex-col text-start", containerClassName)}>
			{label && (
				<div className="my-1 flex gap-2">
					<p className="font-heading text-gray-700 dark:text-gray-400">{label}</p>
					{description && <em className="font-heading text-gray-500 dark:text-gray-700">(*{description})</em>}
				</div>
			)}
			<div className="relative flex w-full items-center">
				<div
					className={twMerge(
						`absolute left-4 flex h-6 w-6 items-center text-gray-400 ${
							iconClick && "hover:text-primary cursor-pointer"
						} ${startIconClassName}`,
					)}
					onClick={iconClick}>
					{startIcon}
				</div>
				<input
					type={showPassword ? "text" : type}
					{...rest}
					{...register}
					required
					className={inputClass}
					placeholder={placeholder}
				/>
				{embeddedComponent ? (
					<div className="absolute right-1.5 flex h-fit w-fit items-center text-gray-400 transition">
						{embeddedComponent}
					</div>
				) : type === "password" ? (
					<div
						className="absolute right-4 flex h-6 w-6 cursor-pointer items-center text-gray-400 transition"
						onClick={() => setShowPassword(!showPassword)}>
						{showPassword ? <ViewIcon /> : <ViewOffIcon />}
					</div>
				) : (
					<div
						className={twMerge(
							`absolute right-4 flex h-6 w-6 items-center text-gray-400 transition ${
								iconClick && "hover:text-primary cursor-pointer"
							} ${endIconClassName}`,
						)}
						onClick={iconClick}>
						{endIcon}
					</div>
				)}
			</div>
			<div className="ml-5">
				{Object.keys(errors)?.length > 0 && errors.message ? (
					<p className="w-full text-sm text-red-400">{errors.message}</p>
				) : description ? (
					<p className="w-full text-sm text-gray-500">{description}</p>
				) : null}
			</div>
		</div>
	)
}

export default FormInput
