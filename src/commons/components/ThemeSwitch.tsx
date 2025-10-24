import { MoonIcon, SunIcon } from "@heroicons/react/20/solid"
import { twMerge } from "tailwind-merge"
import Toggle from "@components/Toggle"
import { useSettingsStore } from "@store/settingsStore"
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs"
import React from "react"

const ThemeSwitch = ({ className = "", tabs = false, icon = false }) => {
	const { darkMode, setDarkMode } = useSettingsStore()

	return (
		<div className={twMerge(`w-fit`, className)}>
			{tabs ? (
				<Tabs value={darkMode ? "dark" : "light"}>
					<TabsList
						className={
							"rounded-2xl border border-outline bg-black/10  dark:bg-white/5"
						}>
						<TabsTrigger
							className={`rounded-xl `}
							onClick={() => setDarkMode(false)}
							value="light">
							<SunIcon
								className={`w-5 ${!darkMode ? "text-primary" : "text-gray-600 dark:text-gray-300"}`}
							/>
						</TabsTrigger>
						<TabsTrigger
							className={`rounded-xl ${darkMode ? "border border-outline " : "text-gray-600"}`}
							onClick={() => setDarkMode(true)}
							value="dark">
							<MoonIcon
								className={`w-5 ${darkMode ? "text-primary" : "text-gray-600 dark:text-gray-300"}`}
							/>
						</TabsTrigger>
					</TabsList>
				</Tabs>
			) : icon ? (
				<span className="flex w-full items-center gap-5">
					<SunIcon className="w-5 text-gray-600" />
					<Toggle
						checked={darkMode}
						onClick={setDarkMode}
					/>
					<MoonIcon className="w-5 text-gray-600" />
				</span>
			) : (
				<span className="flex w-full justify-between">
					<p className="">Dark Theme</p>
					<Toggle
						checked={darkMode}
						onClick={setDarkMode}
					/>
				</span>
			)}
		</div>
	)
}

export default ThemeSwitch
