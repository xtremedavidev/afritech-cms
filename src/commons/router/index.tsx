import { Path, useNavigate } from "./router"
import { useEffect } from "react"
import { Routes } from "@generouted/react-router"
import { useLocation } from "react-router-dom"

export * from "react-router-dom"
export { redirect, useNavigate, Navigate } from "./router"

export const RouterSetup = () => {
	return <Routes />
}

export const usePathname = () => {
	return window.location.pathname
}

export const useRouter = () => {
	const navigate = useNavigate()
	const location = useLocation()

	const push = (path: string) => {
		// If path starts with "/", treat it as absolute
		if (path.startsWith('/')) {
			return navigate(path as any)
		}


		const currentPath = location.pathname.replace(/\/$/, '')
		const fullPath = `${currentPath}/${path}`

		return navigate(fullPath as any)
	}

	const replace = (path: Path) => {
		// Apply same logic for replace
		let finalPath = path
		if (path.startsWith('/')) {
			const currentPath = location.pathname.replace(/\/$/, '')
			finalPath = `${currentPath}/${path}` as any
		}

		return navigate(finalPath, { replace: true })
	}

	return {
		push,
		replace,
	}
}

export const router = useRouter

/*export const redirect = (url: string) => {
	return window.location.replace(url);
};*/

export const setPageTitle = (title: string) => {
	return useEffect(() => {
		document.title = `${title} - MyChange`
	}, [])
}

export default RouterSetup
