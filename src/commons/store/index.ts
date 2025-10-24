import { BProgress } from "@bprogress/core"
import { create } from "zustand"

interface GlobalDataState {
	[key: string]: any
}

interface GlobalState {
	globalData: GlobalDataState
	deviceToken: string
	setDeviceToken: (value: string) => void
	isLoading: boolean
	loader: {
		start: (loadingText?: string) => void
		reset: () => void
	}
	loadingText: string
	updateGlobalData: (value: Partial<GlobalDataState>) => void
}

export const useGlobalStore = create<GlobalState>((set) => ({
	globalData: {},
	deviceToken: null,
	isLoading: false,
	loadingText: "Loading, Please wait...",
	loader: {
		reset: () =>
			set((state) => {
				BProgress.done()
				return { loadingText: "Loading, Please wait...", isLoading: false }
			}),
		start: (loadingText = "Loading, Please wait...") =>
			set((state) => {
				BProgress.start()
				return { isLoading: true, loadingText }
			}),
	},
	setDeviceToken: (token) => set((state) => ({ deviceToken: token })),
	updateGlobalData: (value) => set((state) => ({ globalData: { ...state.globalData, ...value } })),
}))
