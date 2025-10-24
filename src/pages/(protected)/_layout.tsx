import LogoImg from "@assets/images/logo.webp"
import { useGetLoggedInUser } from "@commons/api/auth"
import { useRouter } from "@router"
import useUserStore from "@store/userStore"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"

const ProtectedLayout = ({ children }) => {
	const pathname = window.location.pathname
	const router = useRouter()
	const { setUser } = useUserStore()

	const { data, error, isPending, refetch } = useGetLoggedInUser()
	useEffect(() => {
		if (isPending) return
		if (error && error?.response?.status === 401) {
			router.replace("/login?session_expired=true" as any)
			return
		}
		if (error) {
			router.replace("/login")
			return
		}
	}, [data, error])

	useEffect(() => {
		if (isPending) return
		if (data) {
			if (pathname.includes("login") || pathname.includes("signup") || pathname === "/") {
				router.push("/dashboard")
			}
			setUser(data)
			return
		}
	}, [data])

	if (isPending)
		return (
			<div className="absolute z-50 flex h-screen w-full flex-col items-center justify-center">
				<img
					className={"fill-primary w-[15vw]"}
					src={LogoImg}
				/>
				{/*Progress bar*/}
				<div className="mt-10 w-full max-w-[20%]">
					<div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
						<div className="from-primary to-primary/80 h-full animate-[loading_2s_ease-in-out_infinite] rounded-full bg-gradient-to-r bg-[length:200%_100%]"></div>
					</div>
				</div>
			</div>
		)
	return <Outlet />
}

export default ProtectedLayout
