import "@bprogress/core/css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Outlet } from "@router"
import { Toaster } from "sonner"
import LoadingModal from "@components/modals/Loading.modal"
import { useEffect } from "react"
import { retrieveSettings, useSettingsStore } from "@store/settingsStore"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import PopupModal from "@components/PopupModal"
import ConfirmationModal from "@components/ConfirmationModal"
import SlideOverModal from "@components/SlideOverModal"

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
		},
	},
})
retrieveSettings().then(() => console.log("Settings retrieved and loaded"))

function BaseLayout({}) {
	const { darkMode: isDark } = useSettingsStore()

	useEffect(() => {
		if (isDark) {
			document.documentElement.setAttribute('data-theme', 'dark')
			document.body.classList.add("dark")
		} else {
			document.documentElement.setAttribute('data-theme', 'light')
			document.body.classList.remove("dark")
		}
	}, [isDark])

	return (
		<div className={"h-full w-full"}>
			<TooltipProvider>
				<QueryClientProvider client={queryClient}>
					<ConfirmationModal />
					<PopupModal />
					<SlideOverModal />
					{/*<LoadingModal />*/}
					<Toaster position={"top-right"} />
					<div className={" w-full"}>
						<Outlet />
					</div>
					<ReactQueryDevtools
						buttonPosition={"bottom-right"}
						initialIsOpen={false}
					/>
				</QueryClientProvider>
			</TooltipProvider>
		</div>
	)
}

export default BaseLayout
