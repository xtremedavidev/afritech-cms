import React, { forwardRef, Ref, useEffect, useImperativeHandle, useState } from "react"
import { twMerge } from "tailwind-merge"
import LoadingSpinner from "@components/LoadingSpinner"
import Loading from "../Loading"

interface Props {
	size?: [number, number]
	orientation?: "vertical" | "horizontal"
	children: React.ReactNode
	override?: boolean
}

const BottomSheetLayout = ({ size = [50, 50], override, children }: Props, ref: Ref<any>) => {
	const [screenWidth, setScreenWidth] = useState(window.innerWidth)
	const isMobile = screenWidth <= 768
	const [orientation, setOrientation] = useState<"vertical" | "horizontal">(isMobile ? "vertical" : "horizontal")

	const [sheetHeight, setSheetHeight] = useState(orientation === "vertical" ? 0 : 100)
	const [sheetWidth, setSheetWidth] = useState(orientation === "vertical" ? 100 : 0)
	const [open, setOpen] = useState(override)
	const [contentVisible, setContentVisible] = useState(override)

	useEffect(() => {
		const handleResize = () => {
			setScreenWidth(window.innerWidth)
		}

		window.addEventListener("resize", handleResize)

		return () => {
			window.removeEventListener("resize", handleResize)
		}
	}, [])

	const handleOpen = () => {
		setOpen(true)
		setTimeout(() => toggleSheet(true), 50)
	}

	const handleClose = () => {
		toggleSheet(false)
		setTimeout(() => {
			setOpen(false)
			setContentVisible(false) // Reset content visibility when closing
		}, 300)
	}

	const toggleSheet = (open: boolean) => {
		if (open) {
			if (orientation === "vertical") {
				setSheetHeight(size[1])
			} else {
				setSheetWidth(size[0])
			}
			// Delay content visibility until after transition
			document.body.style.overflow = "hidden"
			setTimeout(() => setContentVisible(true), 500)
		} else {
			if (orientation === "vertical") {
				setSheetHeight(0)
			} else {
				setSheetWidth(0)
			}
			document.body.style.overflow = "auto"
			setContentVisible(false) // Hide content immediately when closing
		}
	}

	useImperativeHandle(ref, () => ({
		handleOpen,
		handleClose,
	}))

	useEffect(() => {
		return () => {
			document.body.style.overflow = "auto"
		}
	}, [open])

	if (!open) return null

	return (
		<>
			<div
				onClick={handleClose}
				className="fixed bottom-0 left-0 right-0 top-0 z-50 h-screen w-screen bg-black opacity-70"
			/>
			<div
				style={{
					width: `${override ? (orientation === "horizontal" ? size[0] : "100") : sheetWidth}%`,
					height: `${override ? (orientation === "vertical" ? size[1] : "100") : sheetHeight}%`,
				}}
				className={twMerge(
					`fixed bottom-0 z-50 flex h-0 flex-col gap-2 overflow-hidden rounded-t-3xl bg-background-50  p-4 duration-300 ease-in-out ${
						orientation === "horizontal"
							? "transition-width left-auto right-0 top-0"
							: "transition-height left-0 right-0 top-auto"
					}`,
				)}>
				{/* Conditionally render children after transition */}
				{(contentVisible && orientation === "horizontal") || orientation === "vertical" ? (
					<>
						{orientation === "vertical" && (
							<div className="w-full overflow-hidden">
								<div className="m-auto h-2 w-12 rounded-full bg-gray-300" />
							</div>
						)}
						{children}
					</>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<Loading.Spinner />
					</div>
				)}
			</div>
		</>
	)
}

export default forwardRef(BottomSheetLayout)

export const openBottomSheet = (ref: any) => {
	ref.current?.handleOpen()
}

export const dismissBottomSheet = (ref: any) => {
	ref.current?.handleClose()
}
