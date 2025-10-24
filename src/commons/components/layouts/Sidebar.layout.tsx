import CustomText from "@components/CustomText"
import { useRouter } from "@router"
import { useSettingsStore } from "@store/settingsStore"
import useUserStore, { logout } from "@store/userStore"
import { COLORS } from "@utils"
import { Logout04Icon, UserIcon } from "hugeicons-react"
import {
	BriefcaseBusinessIcon,
	LayoutIcon,
	MailIcon,
	MessageCircleMoreIcon,
	NetworkIcon,
	PhoneIcon,
	Share2Icon,
	SidebarIcon,
} from "lucide-react"
import React, { ReactElement } from "react"
import { useLocation } from "react-router-dom"
import { twMerge } from "tailwind-merge"
import { CustomIcons } from "../../assets/icons"

interface Props {
	className?: string
}

type SidebarItem =
	| {
			name: string
			icon: {
				active: ReactElement
				default: ReactElement
			}
			action: () => void
			visible: boolean
			type: "main_menu" | "account"
			badge: number
	  }
	| {
			name: string
			icon: {
				active: ReactElement
				default: ReactElement
			}
			type: "main_menu" | "account"
			badge: number
			visible: boolean
			link: string
	  }

const SidebarLayout = ({ className = "" }: Props) => {
	const { minimizeSidebar, setMinimizeSidebar } = useSettingsStore()
	const router = useRouter()
	const { user } = useUserStore()

	const links: SidebarItem[] = [
		{
			name: "Dashboard",
			icon: {
				active: <CustomIcons.Filled.Home />,
				default: <CustomIcons.Outlined.Home />,
			},
			link: "/dashboard",
			type: "main_menu",
			visible: true,
			badge: 0,
		},
		{
			name: "Home",
			icon: {
				active: <LayoutIcon className="size-4 text-purple-800" />,
				default: <LayoutIcon className="size-4" />,
			},
			type: "main_menu",
			badge: 0,
			visible: true,
			link: "/home",
		},
		{
			name: "Blogs",
			icon: {
				active: <CustomIcons.Filled.Blog />,
				default: <CustomIcons.Outlined.Blog />,
			},
			type: "main_menu",
			badge: 0,
			visible: true,
			link: "/blogs",
		},
		{
			name: "Services",
			icon: {
				active: <CustomIcons.Filled.Services />,
				default: <CustomIcons.Outlined.Services />,
			},
			link: "/services",
			type: "main_menu",
			visible: true,
			badge: 0,
		},
		{
			name: "Projects",
			icon: {
				active: <CustomIcons.Filled.Projects />,
				default: <CustomIcons.Outlined.Projects />,
			},
			link: "/projects",
			type: "main_menu",
			visible: true,
			badge: 0,
		},
		{
			name: "About us",
			icon: {
				active: <UserIcon className="size-4 text-purple-800" />,
				default: <UserIcon className="size-4" />,
			},
			type: "main_menu",
			badge: 0,
			visible: true,
			link: "/about-us",
		},
		{
			name: "Contact us",
			icon: {
				active: <MailIcon className="size-4 text-purple-800" />,
				default: <MailIcon className="size-4" />,
			},
			type: "main_menu",
			badge: 0,
			visible: true,
			link: "/contact-us",
		},
		{
			name: "People",
			icon: {
				active: <CustomIcons.Filled.People />,
				default: <CustomIcons.Outlined.People />,
			},
			type: "main_menu",
			badge: 0,
			visible: true,
			link: "/team",
		},
		{
			name: "Testimonials",
			icon: {
				active: <MessageCircleMoreIcon className="size-4 text-purple-800" />,
				default: <MessageCircleMoreIcon className="size-4" />,
			},
			type: "main_menu",
			badge: 0,
			visible: true,
			link: "/testimonials",
		},
		{
			name: "Our process",
			icon: {
				active: <NetworkIcon className="size-4 text-purple-800" />,
				default: <NetworkIcon className="size-4" />,
			},
			type: "main_menu",
			badge: 0,
			visible: true,
			link: "/our-process",
		},
		{
			name: "Our deliverables",
			icon: {
				active: <BriefcaseBusinessIcon className="size-4 text-purple-800" />,
				default: <BriefcaseBusinessIcon className="size-4" />,
			},
			type: "main_menu",
			badge: 0,
			visible: true,
			link: "/our-deliverables",
		},
		{
			name: "Call to action",
			icon: {
				active: <PhoneIcon className="size-4 text-purple-800" />,
				default: <PhoneIcon className="size-4" />,
			},
			type: "main_menu",
			badge: 0,
			visible: true,
			link: "/call-to-action",
		},
		{
			name: "Footer",
			icon: {
				active: <Share2Icon className="size-4 text-purple-800" />,
				default: <Share2Icon className="size-4" />,
			},
			type: "main_menu",
			badge: 0,
			visible: true,
			link: "/footer",
		},
		{
			name: "Logout",
			icon: {
				active: <Logout04Icon className={"text-red-500"} />,
				default: <Logout04Icon className={"text-red-500"} />,
			},
			type: "account",
			badge: 0,
			visible: true,
			action: () => {
				logout()
				window.location.replace("/login")
			},
		},
	]

	return (
		<div
			className={twMerge(
				`transition-width border-outline bg-background relative z-[9000] h-full border-r duration-300  ${minimizeSidebar ? "w-[8%]" : "w-[25%]"}`,
				className,
			)}>
			<div className="flex h-full w-full flex-col">
				<div
					className={`flex h-[20%] w-full flex-col justify-center py-3 ${minimizeSidebar ? "items-center" : "items-end"} px-[10%]`}>
					<SidebarIcon
						className={"cursor-pointer text-gray-700 dark:text-gray-400"}
						onClick={() => setMinimizeSidebar(!minimizeSidebar)}
					/>
				</div>

				<div className="flex min-h-[80%] w-full flex-col overflow-clip overflow-y-scroll">
					{links
						.filter((x) => x.type === "main_menu" && x.visible)
						.map((link, index) => (
							<MenuItem
								key={index}
								item={link}
							/>
						))}
				</div>

				<div className="mt-[15%] flex h-[15%] w-full flex-col overflow-clip">
					{links
						.filter((x) => x.type === "account" && x.visible)
						.map((link, index) => (
							<MenuItem
								className={"text-red-500"}
								key={index}
								item={link}
							/>
						))}
				</div>
			</div>
		</div>
	)
}

export default SidebarLayout

const MenuItem = ({
	item,
	className = "",
}: {
	item: SidebarItem & { link?: string; action?: () => void }
	className?: string
}) => {
	const pathname = useLocation().pathname
	const isActive = item?.link === pathname
	const router = useRouter()
	const { minimizeSidebar, setMinimizeSidebar } = useSettingsStore()

	function onClick() {
		if (item?.action) return item?.action()
		else return router.push(item.link)
	}

	return (
		<div
			onClick={onClick}
			className={twMerge("my-0", className)}>
			<div
				className={`group mx-5 my-2 flex cursor-pointer items-center justify-center rounded-xl px-4 py-3 transition duration-500 hover:bg-black/20 dark:hover:bg-white/10 ${isActive ? "bg-dark/20 dark:bg-white/10" : "bg-transparent"}`}>
				<div className={`m-0 w-8 transition duration-500`}>
					{isActive
						? React.cloneElement(item.icon.active, { size: 24, color: COLORS.primary } as any)
						: React.cloneElement(item.icon.default, { size: 24 } as any)}
				</div>

				<div
					className={`${minimizeSidebar ? "w-0 opacity-0" : "mx-4 flex w-full justify-between opacity-100"} transition-opacity duration-500 `}>
					<CustomText
						className={`w-full items-center text-sm capitalize`}
						text={item.name}
					/>
					{item.badge > 0 && (
						<span className="bg-secondary flex aspect-square h-8 w-8 items-center justify-center rounded-full p-1 text-sm ">
							{item.badge}
						</span>
					)}
				</div>
			</div>
		</div>
	)
}
