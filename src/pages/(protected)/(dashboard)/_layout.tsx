import React, { useEffect } from "react"
import { Outlet } from "react-router-dom"
import SidebarLayout from "@components/layouts/Sidebar.layout"
import { useSettingsStore } from "@store/settingsStore"
import Header from "@components/layouts/Header.layout"

const DashboardLayout = ({ children }) => {
	const { setMinimizeSidebar } = useSettingsStore()

	useEffect(() => {
		//setTimeout(() => setMinimizeSidebar(true), 5000)
	}, [])

	return (
		<main className="flex h-screen w-full justify-between overflow-clip">
			<SidebarLayout />

			<div className={`ml-0 flex h-screen w-full flex-col overflow-auto `}>
				<Header className={"px-8"} />

				<div className={"px-4"}>{children ? children : <Outlet />}</div>
			</div>
		</main>
	)
}

export default DashboardLayout
