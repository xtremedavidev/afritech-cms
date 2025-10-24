import React, { Component } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cancel01Icon } from "hugeicons-react"

interface SlideOverModalProps {
	view: React.ReactNode
	canDismiss?: boolean
	width?: string
	key?: string
}

interface SlideOverSheet {
	id: string
	view: React.ReactNode
	canDismiss: boolean
	width: HTMLDivElement["style"]["width"]
	zIndex: number
}

interface SlideOverModalState {
	sheets: Map<string, SlideOverSheet>
	sheetOrder: string[]
}

class SlideOverModalManager extends Component<{}, SlideOverModalState> {
	private static instance: SlideOverModalManager | null = null
	private static keyCounter: number = 0

	constructor(props: {}) {
		super(props)
		this.state = {
			sheets: new Map([
				/*["default", {
					id: "default",
					view: <div className={"h-full w-full bg-green-500 p-4"}>Sample Content</div>,
					canDismiss: true,
					width: "30vw",
					zIndex: 10000
				}]*/
			]),
			sheetOrder: [],
		}
		SlideOverModalManager.instance = this
	}

	static show({ view, canDismiss = true, width = "30vw", key }: SlideOverModalProps) {
		if (SlideOverModalManager.instance) {
			const sheetKey = key || `sheet-${++SlideOverModalManager.keyCounter}`
			const currentState = SlideOverModalManager.instance.state
			const newSheets = new Map(currentState.sheets)
			const newOrder = [...currentState.sheetOrder]

			// Calculate z-index based on order
			const baseZIndex = 10000
			const zIndex = baseZIndex + newOrder.length

			const sheet: SlideOverSheet = {
				id: sheetKey,
				view,
				canDismiss,
				width,
				zIndex,
			}

			// If sheet with this key already exists, replace it
			if (newSheets.has(sheetKey)) {
				newSheets.set(sheetKey, { ...sheet, zIndex: newSheets.get(sheetKey)!.zIndex })
			} else {
				newSheets.set(sheetKey, sheet)
				newOrder.push(sheetKey)
			}

			SlideOverModalManager.instance.setState({
				sheets: newSheets,
				sheetOrder: newOrder,
			})

			return sheetKey
		}
		return null
	}

	static hide(key?: string) {
		if (SlideOverModalManager.instance) {
			const currentState = SlideOverModalManager.instance.state

			if (key) {
				// Hide specific sheet
				const newSheets = new Map(currentState.sheets)
				const newOrder = currentState.sheetOrder.filter((id) => id !== key)
				newSheets.delete(key)

				SlideOverModalManager.instance.setState({
					sheets: newSheets,
					sheetOrder: newOrder,
				})
			} else {
				// Hide the topmost sheet
				if (currentState.sheetOrder.length > 0) {
					const topSheetKey = currentState.sheetOrder[currentState.sheetOrder.length - 1]
					SlideOverModalManager.hide(topSheetKey)
				}
			}
		}
	}

	static hideAll() {
		if (SlideOverModalManager.instance) {
			SlideOverModalManager.instance.setState({
				sheets: new Map(),
				sheetOrder: [],
			})
		}
	}

	static isOpen(key?: string): boolean {
		if (SlideOverModalManager.instance) {
			const currentState = SlideOverModalManager.instance.state
			if (key) {
				return currentState.sheets.has(key)
			}
			return currentState.sheetOrder.length > 0
		}
		return false
	}

	static getOpenSheets(): string[] {
		if (SlideOverModalManager.instance) {
			return [...SlideOverModalManager.instance.state.sheetOrder]
		}
		return []
	}

	handleClose = (sheetKey: string) => {
		const sheet = this.state.sheets.get(sheetKey)
		if (sheet && sheet.canDismiss) {
			SlideOverModalManager.hide(sheetKey)
		}
	}

	handleBackdropClick = (sheetKey: string) => {
		// Only close if this is the topmost sheet
		const topSheetKey = this.state.sheetOrder[this.state.sheetOrder.length - 1]
		if (sheetKey === topSheetKey) {
			this.handleClose(sheetKey)
		}
	}

	render() {
		const { sheets, sheetOrder } = this.state

		return (
			<AnimatePresence>
				{sheetOrder.map((sheetKey, index) => {
					const sheet = sheets.get(sheetKey)
					if (!sheet) return null

					const isTopmost = index === sheetOrder.length - 1
					const offsetX = index * 20 // Slight offset for stacked effect

					return (
						<div
							key={sheetKey}
							className="fixed inset-0 overflow-hidden"
							style={{ zIndex: sheet.zIndex }}>
							{/* Backdrop - only show for topmost sheet */}
							{isTopmost && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
									onClick={() => this.handleBackdropClick(sheetKey)}
									className="absolute inset-0 bg-gray-900 bg-opacity-10 backdrop-blur-sm"
								/>
							)}

							{/* Slide over panel */}
							<div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
								<motion.div
									initial={{ x: "100%" }}
									animate={{ x: -offsetX }}
									exit={{ x: "100%" }}
									transition={{
										type: "spring",
										stiffness: 300,
										damping: 30,
										duration: 0.3,
									}}
									style={{
										width: sheet.width,
									}}
									className={`pointer-events-auto`}>
									<div
										className={`flex h-full flex-col bg-white shadow-xl dark:bg-gray-800 ${
											!isTopmost ? "opacity-90" : ""
										}`}>
										{/* Header with close button */}
										{sheet.canDismiss && (
											<motion.div
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.1, duration: 0.2 }}
												className="flex items-center justify-between px-4 py-3">
												<div className="flex items-center space-x-2">
													{sheetOrder.length > 1 && (
														<span className="text-xs text-gray-500 dark:text-gray-400">
															{index + 1} of {sheetOrder.length}
														</span>
													)}
													<span className="text-xs text-gray-400 dark:text-gray-500">
														{sheetKey}
													</span>
												</div>

												<div
													onClick={() => this.handleClose(sheetKey)}
													className="cursor-pointer rounded-md p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700">
													<Cancel01Icon size={20} />
												</div>
											</motion.div>
										)}

										{/* Content */}
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.15, duration: 0.3 }}
											className="relative flex-1 overflow-y-auto">
											{sheet.view}
										</motion.div>
									</div>
								</motion.div>
							</div>
						</div>
					)
				})}
			</AnimatePresence>
		)
	}
}

export const SlideOverModalProvider = SlideOverModalManager

export const showSlideOverModal = SlideOverModalManager.show
export const hideSlideOverModal = SlideOverModalManager.hide
export const dismissSlideOverModal = SlideOverModalManager.hide
export const hideAllSlideOverModals = SlideOverModalManager.hideAll
export const isSlideOverModalOpen = SlideOverModalManager.isOpen
export const getOpenSlideOverModals = SlideOverModalManager.getOpenSheets

export default SlideOverModalManager
