import React from "react"
import { usePathname, useRouter } from "@router"
import ThemeSwitch from "@components/ThemeSwitch"
import DynamicBreadcrumb from "@components/DynamicBreadcrumb"
import { twMerge } from "tailwind-merge"
import { useSettingsStore } from "@store/settingsStore"
import { Notification02Icon } from "hugeicons-react"
import useUserStore, { logout } from "@store/userStore"

type Props = {
	className?: string
} & React.PropsWithChildren

const Header = ({ className = "" }: Props) => {
	const { setMinimizeSidebar, minimizeSidebar } = useSettingsStore()
	const { user } = useUserStore()
	const router = useRouter()
	const pathname = usePathname()

	return (
		<div
			className={twMerge(
				"bg-background sticky top-0 z-50 flex min-h-fit w-full items-center justify-between px-8 py-6 ",
				className,
			)}>
			<div className="flex w-[50%] flex-col">
				<div className="flex flex-row items-center">
					<DynamicBreadcrumb className={"ml-4"} />
				</div>

				{/*<FormInput
					startIcon={<Search01Icon className={"w-5 mt-1"} />}
					variant={"secondary"}
					className={"py-2 mt-3"}
					placeholder={"Search..."}
				/>*/}
			</div>

			<div className="flex flex-row items-center gap-x-4">
				<ThemeSwitch tabs />

				<div className="border-outline rounded-2xl border bg-black/10 p-2  dark:bg-white/10 ">
					<Notification02Icon />
				</div>

				<div className="border-outline flex w-[80%] flex-row items-center rounded-2xl border bg-black/10 p-2  dark:bg-white/10 ">
					<img
						className={"aspect-square h-8 rounded-full"}
						src={`https://ui-avatars.com/api/?name=${user?.fullName}`}
					/>
					<div className="mx-2 flex flex-col">
						<p className="text-sm font-medium">{user?.fullName}</p>
						<p
							onClick={logout}
							className="text-xs cursor-pointer text-red-700 dark:text-red-300">
							Logout
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Header
