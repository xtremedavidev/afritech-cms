import React, { useState } from "react"
import { twMerge } from "tailwind-merge"
import CustomText from "@components/CustomText"
import CustomButton from "@/src/commons/components/CustomButton"
import FormInput from "@/src/commons/components/FormInput"
import { HugeIcons } from "@/src/commons/assets/icons"

interface KeyValueItem {
	key: string
	value: string
}

interface KeyValueInputProps {
	value: KeyValueItem[]
	onChange: (items: KeyValueItem[]) => void
	disabled?: boolean
	className?: string
	label?: string
	placeholder?: {
		key?: string
		value?: string
	}
	defaultItems?: Array<{
		key: string
		label: string
		placeholder?: string
	}>
	allowCustom?: boolean
	validation?: {
		keyRequired?: boolean
		valueRequired?: boolean
		valueValidation?: (value: string) => boolean | string
	}
}

const DEFAULT_SOCIAL_PLATFORMS = [
	{ key: "twitter", label: "Twitter/X", placeholder: "https://x.com/userkey" },
	{ key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/userkey" },
	{ key: "github", label: "GitHub", placeholder: "https://github.com/userkey" },
	{ key: "instagram", label: "Instagram", placeholder: "https://instagram.com/userkey" },
	{ key: "facebook", label: "Facebook", placeholder: "https://facebook.com/userkey" },
	{ key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@userkey" },
	{ key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@userkey" },
	{ key: "dribbble", label: "Dribbble", placeholder: "https://dribbble.com/userkey" },
	{ key: "behance", label: "Behance", placeholder: "https://behance.net/userkey" },
	{ key: "website", label: "Website", placeholder: "https://your-website.com" },
]

export default function KeyValueInput({
	value = [],
	onChange,
	disabled = false,
	className,
	label = "Items",
	placeholder = { key: "Name", value: "URL" },
	defaultItems = DEFAULT_SOCIAL_PLATFORMS,
	allowCustom = true,
	validation = {
		keyRequired: true,
		valueRequired: true,
		valueValidation: (value) => {
			try {
				new URL(value)
				return true
			} catch {
				return "Invalid URL format"
			}
		},
	},
}: KeyValueInputProps) {
	const [customName, setCustomName] = useState("")
	const [customUrl, setCustomUrl] = useState("")
	const [showCustomInput, setShowCustomInput] = useState(false)
	const [errors, setErrors] = useState<{ key?: string; value?: string }>({})

	// Get available default items (not yet added)
	const availableDefaults = defaultItems.filter(
		(defaultItem) => !value.some((item) => item.key === defaultItem.key),
	)

	const validateInput = (key: string, value: string): boolean => {
		const newErrors: { key?: string; value?: string } = {}

		if (validation.keyRequired && !key.trim()) {
			newErrors.key = "Name is required"
		}

		if (validation.valueRequired && !value.trim()) {
			newErrors.value = "URL is required"
		} else if (value.trim() && validation.valueValidation) {
			const valueValidationResult = validation.valueValidation(value)
			if (valueValidationResult !== true) {
				newErrors.value = typeof valueValidationResult === "string" ? valueValidationResult : "Invalid URL"
			}
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleAddDefault = (defaultItem: (typeof defaultItems)[0]) => {
		const newItem: KeyValueItem = {
			key: defaultItem.key,
			value: "",
		}
		onChange([...value, newItem])
	}

	const handleAddCustom = () => {
		if (!validateInput(customName, customUrl)) return

		// Check if key already exists
		if (value.some((item) => item.key.toLowerCase() === customName.toLowerCase())) {
			setErrors({ key: "Name already exists" })
			return
		}

		const newItem: KeyValueItem = {
			key: customName.toLowerCase(),
			value: customUrl,
		}

		onChange([...value, newItem])
		setCustomName("")
		setCustomUrl("")
		setShowCustomInput(false)
		setErrors({})
	}

	const handleUpdateItem = (index: number, field: "key" | "value", newValue: string) => {
		const updatedItems = [...value]
		updatedItems[index] = { ...updatedItems[index], [field]: newValue }
		onChange(updatedItems)
	}

	const handleRemoveItem = (index: number) => {
		const updatedItems = value.filter((_, i) => i !== index)
		onChange(updatedItems)
	}

	const getLabelForItem = (itemName: string): string => {
		const defaultItem = defaultItems.find((item) => item.key === itemName)
		return defaultItem?.label || itemName.charAt(0).toUpperCase() + itemName.slice(1)
	}

	const getPlaceholderForItem = (itemName: string): string => {
		const defaultItem = defaultItems.find((item) => item.key === itemName)
		return defaultItem?.placeholder || placeholder.value || "Enter URL"
	}

	return (
		<div className={twMerge("flex flex-col gap-y-3", className)}>
			{/* Existing Items */}
			{value.map((item, index) => (
				<div
					key={`${item.key}-${index}`}
					className="flex flex-col gap-y-2">
					<div className="flex items-center justify-between">
						<CustomText
							text={getLabelForItem(item.key)}
							className="text-sm font-medium text-gray-700 dark:text-gray-300"
						/>
						{!disabled && (
							<CustomButton
								variant="text"
								onClick={() => handleRemoveItem(index)}
								className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
								startIcon={<HugeIcons.Delete01Icon size={16} />}
							/>
						)}
					</div>
					<FormInput
						value={item.value}
						onChange={(e) => handleUpdateItem(index, "value", e.target.value)}
						placeholder={getPlaceholderForItem(item.key)}
						disabled={disabled}
						className="flex-1"
					/>
				</div>
			))}

			{!disabled && (
				<div className="flex flex-col gap-y-3">
					{/* Available Default Items */}
					{availableDefaults.length > 0 && (
						<div className="flex flex-col gap-y-2">
							<div className="flex flex-wrap gap-2">
								{availableDefaults.map((defaultItem) => (
									<CustomButton
										key={defaultItem.key}
										variant="outlined"
										onClick={() => handleAddDefault(defaultItem)}
										className="rounded-full px-3 py-1 text-xs"
										text={defaultItem.label}
										startIcon={<HugeIcons.Add01Icon size={14} />}
									/>
								))}
							</div>
						</div>
					)}

					{/* Custom Input */}
					{allowCustom && (
						<div className="flex flex-col gap-y-2">
							{!showCustomInput ? (
								<CustomButton
									variant="outlined"
									onClick={() => setShowCustomInput(true)}
									className="w-fit rounded-lg border-dashed px-4 py-2 text-sm"
									text="Add Custom Platform"
									startIcon={<HugeIcons.Add01Icon size={16} />}
								/>
							) : (
								<div className="flex flex-col gap-y-3 rounded-lg border border-dashed border-gray-300 p-4 dark:border-gray-600">
									<CustomText
										text="Add Custom Platform:"
										className="text-sm font-medium text-gray-700 dark:text-gray-300"
									/>
									<div className="flex flex-col gap-y-2">
										<FormInput
											value={customName}
											onChange={(e) => setCustomName(e.target.value)}
											placeholder={placeholder.key}
											errors={errors.key ? { message: errors.key } : undefined}
										/>
										<FormInput
											value={customUrl}
											onChange={(e) => setCustomUrl(e.target.value)}
											placeholder={placeholder.value}
											errors={errors.value ? { message: errors.value } : undefined}
										/>
									</div>
									<div className="flex gap-x-2">
										<CustomButton
											onClick={handleAddCustom}
											className="px-4 py-2 text-sm"
											text="Add"
											startIcon={<HugeIcons.CheckmarkCircle01Icon size={16} />}
										/>
										<CustomButton
											variant="outlined"
											onClick={() => {
												setShowCustomInput(false)
												setCustomName("")
												setCustomUrl("")
												setErrors({})
											}}
											className="px-4 py-2 text-sm"
											text="Cancel"
											startIcon={<HugeIcons.Cancel01Icon size={16} />}
										/>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	)
}
