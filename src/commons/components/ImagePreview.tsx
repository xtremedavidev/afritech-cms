import { XMarkIcon } from "@heroicons/react/24/outline"

const ImagePreview = ({ src, onCancel, disabled }) => {
	return (
		<div className={"relative h-full flex-1"}>
			{!disabled && (
				<span
					onClick={onCancel}
					className="border-dark absolute right-2 top-2 h-6 w-6 cursor-pointer rounded-full border bg-white bg-opacity-70 p-1 drop-shadow-2xl">
					<XMarkIcon className={"text-dark"} />
				</span>
			)}
			<img
				alt="image"
				src={src}
				className={"bg-primary h-full w-full rounded-xl object-cover"}
			/>
		</div>
	)
}

export default ImagePreview
