import LogoImg from "@assets/images/logo.webp"
import { useGetLoggedInUser } from "@commons/api/auth"
import ThemeSwitch from "@components/ThemeSwitch"
import { useRouter } from "@router"
import { useGlobalStore } from "@store"
import useUserStore from "@store/userStore"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"

const AuthLayout = ({ children }) => {
	const { loader } = useGlobalStore()
	const { setUser } = useUserStore()
	const router = useRouter()
	const { data, isPending } = useGetLoggedInUser()

	useEffect(() => {
		if (data) {
			setUser(data)
			router.push("/dashboard")
		}
	}, [data])

	return (
		<div className="flex h-screen flex-row items-center justify-between">
			<div className="bg-background z-20 h-full w-full md:w-[50%]">{children ? children : <Outlet />}</div>
			<div className="relative hidden h-full w-0 flex-col items-center p-5 md:flex md:w-[50%]">
				<div className={"z-20 flex w-full justify-end"}>
					<ThemeSwitch
						icon
						className={"my-5 "}
					/>
				</div>

				{/*<img
					src={BgPattern}
					className={"absolute left-0 top-0 h-full w-full dark:opacity-50"}
					alt={"bg"}
				/>*/}

				<div className={"flex h-screen flex-col items-center justify-center "}>
					<div className={"z-20 flex flex-col items-center"}>
						<img
							className={"fill-text w-[15vw]"}
							src={LogoImg}
						/>
						<h1 className={"mt-[10%] text-4xl font-bold"}>Afritech54</h1>
						<h1 className={"text-2xl text-gray-500"}>Website CMS</h1>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AuthLayout
