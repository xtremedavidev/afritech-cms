import React, { Component } from "react"
import CustomButton from "@components/CustomButton"

interface ConfirmationModalProps {
	title?: string
	message: string
	onConfirm: () => void
	confirmText?: string
	cancelText?: string
}

interface ConfirmationModalState {
	visible: boolean
	title?: string
	message: string
	onConfirm: () => void
	confirmText?: string
	cancelText?: string
}

class ConfirmationModalManager extends Component<{}, ConfirmationModalState> {
	private static instance: ConfirmationModalManager | null = null

	constructor(props: {}) {
		super(props)
		this.state = {
			visible: false,
			title: "",
			message: "Are you sure you want to perform this action?",
			onConfirm: () => {},
			confirmText: "Yes, Confirm",
			cancelText: "No, Cancel",
		}
		ConfirmationModalManager.instance = this
	}

	static show({ title, message, onConfirm, confirmText, cancelText }: ConfirmationModalProps) {
		if (ConfirmationModalManager.instance) {
			ConfirmationModalManager.instance.setState({
				visible: true,
				title,
				onConfirm,
				message: message || "Are you sure you want to perform this action?",
				confirmText: confirmText || "Yes, Confirm",
				cancelText: cancelText || "No, Cancel",
			})
		}
	}

	static hide() {
		if (ConfirmationModalManager.instance) {
			ConfirmationModalManager.instance.setState({ visible: false })
		}
	}

	handleClose = () => {
		this.setState({ visible: false })
	}

	render() {
		const { visible, title, message, onConfirm, confirmText, cancelText } = this.state

		if (!visible) return null

		return (
			<div className="absolute bottom-0 left-0 right-0 top-0 z-[80000] flex h-full w-screen items-center justify-center bg-background-50/20 bg-opacity-10 backdrop-blur-sm">
				<div className="flex w-[90%] flex-col items-center rounded-2xl border border-outline bg-background-50 p-6 dark:border-white/30  md:w-[30%]">
					{title && <p className="text-center text-2xl font-bold">{title}</p>}
					<p className="mb-4 mt-2 text-center text-gray-700 dark:text-gray-300">{message}</p>
					<div className="mt-6  flex w-full flex-col items-center gap-y-2">
						<CustomButton
							text={confirmText}
							onClick={() => {
								onConfirm()
								this.handleClose()
							}}
							className="h-12 w-full"
						/>
						<CustomButton
							text={cancelText}
							variant={"outlined"}
							onClick={this.handleClose}
							className="h-12 w-full"
						/>
					</div>
				</div>
			</div>
		)
	}
}

export const ConfirmationModalProvider = ConfirmationModalManager

export const showConfirmationModal = ConfirmationModalManager.show
export const hideConfirmationModal = ConfirmationModalManager.hide

export default ConfirmationModalManager
