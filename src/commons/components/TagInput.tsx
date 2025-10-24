import { Input } from "@components/ui/input"
import { X } from "lucide-react"
import { useState } from "react"

interface TagInputProps {
	value: string[]
	onChange: (tags: string[]) => void
	maxTags?: number
	placeholder?: string
	disabled?: boolean
}

export function TagInput({
	value,
	onChange,
	disabled,
	maxTags = 8,
	placeholder = "Enter Tags and press enter",
}: TagInputProps) {
	const [inputValue, setInputValue] = useState("")

	const addTag = (tag: string) => {
		if (tag && !value.includes(tag) && value.length < maxTags) {
			onChange([...value, tag])
		}
	}

	const removeTag = (tag: string) => {
		onChange(value.filter((t) => t !== tag))
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()
			addTag(inputValue.trim())
			setInputValue("")
		}
	}

	return (
		<div className="space-y-2">
			<div className="border-input flex flex-wrap gap-2 rounded-xl border p-2">
				{value.map((tag) => (
					<span
						key={tag}
						className="bg-primary/20 text-text flex items-center gap-1 rounded-xl px-2 py-1 text-sm">
						{tag}
						{!disabled && (
							<button
								type="button"
								onClick={() => removeTag(tag)}
								className="text-text-faded hover:text-text cursor-pointer">
								<X size={14} />
							</button>
						)}
					</span>
				))}
				{value.length < maxTags && (
					<Input
						disabled={disabled}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						className="placeholder:text-text-faded/60 bg-transparent min-w-[120px] flex-1 border-none shadow-none focus-visible:ring-0"
					/>
				)}
			</div>
			<p className="text-text-faded text-xs">You can add as many as {maxTags} entries, pressing Enter.</p>
		</div>
	)
}
