import { create } from "zustand"
import { ADMIN_ACCESS_LEVELS_HIERARCHY } from "@utils/logic"
import { ADMIN_ACCESS_LEVELS } from "@utils/enum"
import { api, updateAuthToken } from "@utils/axiosProvider"
import router from "../router"

interface UserState {
	user: IUser
	setUser: (userData: IUser) => void
}

const useUserStore = create<UserState>((set) => ({
	user: null,
	setUser: (user) => set((state) => ({ user })),
}))
export const hasAccess = (minimum_role_required: ADMIN_ACCESS_LEVELS | string) => {
	/*return (
		ADMIN_ACCESS_LEVELS_HIERARCHY[useUserStore().user?.role] >= ADMIN_ACCESS_LEVELS_HIERARCHY[minimum_role_required]
	)*/
}

export default useUserStore

export const refreshLoggedInUser = async () => {
	const { setUser } = useUserStore.getState()
	return await api
		.get("/get-user")
		.then(({ user }) => {
			console.log("User", user)
			setUser(user)
			return user
		})
		.catch((e) => {
			console.log("Error fetching data", e)
			throw e
		})
}

export const refreshAll = async () => {
	await refreshLoggedInUser()
}

export const logout = async () => {
	const { setUser } = useUserStore.getState()
	await updateAuthToken(null, true)
	setUser(null)
	window.location.href = "/login"
}
