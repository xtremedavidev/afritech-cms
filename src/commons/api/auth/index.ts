import { useMutation, useQuery } from "@tanstack/react-query"
import { api, updateAuthToken } from "@utils/axiosProvider"
import { Keys } from "@utils"
import { toast } from "sonner"
import { AxiosError } from "axios"
import useUserStore from "@store/userStore"

export function useUserLogin() {
	const {setUser} = useUserStore()
	return useMutation({
		mutationFn: (data: { email: string; password: string }) => api.post("/auth/login", {
			emailOrUsername: data?.email,
			password: data?.password,
		}),
		onSuccess: (data) => {
			updateAuthToken(data?.token, true)
			setUser(data?.user)
		},
		onError: (error: AxiosError<{ message: string }>) => {
			toast.error(error.response.data.message)
		},
	})
}

export function useGetLoggedInUser() {
	return useQuery<any, AxiosError, IAuthData>({
		queryKey: [Keys.user],
		retry: 1,
		queryFn: () => api.get("/auth/profile", {}),
		select: (data) => {
			console.log("Fetched user:", data)
			return data.user
		},
	})
}

export function useForgotPassword() {
	return useMutation({
		mutationFn: (data: { email?: string }) => api.post("/auth/forgot-password", data),
		onSuccess: (data) => {
			toast.success(data?.message)
		},
		onError: (error: AxiosError<{ message: string }>) => {
			toast.error(error.response.data.message)
		},
	})
}
