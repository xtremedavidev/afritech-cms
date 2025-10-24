import React, { Component } from "react"
import CustomButton from "@components/CustomButton"
import { Cancel01Icon } from "hugeicons-react"

interface PopupModalProps {
	view: React.ReactNode
	canDismiss?: boolean
}

interface PopupModalState {
	visible: boolean
	view: React.ReactNode
	canDismiss: boolean
}

class PopupModalManager extends Component<{}, PopupModalState> {
	private static instance: PopupModalManager | null = null

	constructor(props: {}) {
		super(props)
		this.state = {
			visible: false,
			view: <div className={"h-[20vh] w-full bg-green-500"}></div>,
			canDismiss: true,
		}
		/*this.state = {
			visible: true,
			view: <PromptBranchTopUp />,
			canDismiss: true,
		}*/
		PopupModalManager.instance = this
	}

	static show({ view, canDismiss }: PopupModalProps) {
		if (PopupModalManager.instance) {
			PopupModalManager.instance.setState({
				visible: true,
				canDismiss: true,
				view,
			})
		}
	}

	static hide() {
		if (PopupModalManager.instance) {
			PopupModalManager.instance.setState({ visible: false })
		}
	}

	handleClose = () => {
		this.setState({ visible: false })
	}

	render() {
		const { visible, view, canDismiss } = this.state

		if (!visible) return null

		return (
			<div className="absolute bottom-0 left-0 right-0 top-0 z-[5000] flex h-full w-screen items-center justify-center bg-gray-700 bg-opacity-10 backdrop-blur-sm dark:bg-gray-200/30">
				{canDismiss && (
					<div
						onClick={this.handleClose}
						className="absolute h-full w-full bg-transparent"></div>
				)}
				<div className="z-50 flex flex-col items-center justify-center">
					{view}
					{canDismiss && (
						<CustomButton
							text={"Dismiss"}
							startIcon={<Cancel01Icon />}
							variant={"text"}
							onClick={this.handleClose}
							className={"mt-4 w-fit"}
						/>
					)}
				</div>
			</div>
		)
	}
}

export const PopupModalProvider = PopupModalManager

export const showPopupModal = PopupModalManager.show
export const hidePopupModal = PopupModalManager.hide
export const dismissPopupModal = PopupModalManager.hide

export default PopupModalManager
