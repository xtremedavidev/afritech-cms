import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "@utils/axiosProvider"
import { AxiosError } from "axios"
import { IAboutContent, IAboutHero } from "./index.interface"

const AboutKey = "about"
const AboutContentKey = "about/afritech54"

export function useGetAboutHero() {
	return useQuery<any, AxiosError, IAboutHero>({
		initialData: { data: null },
		queryKey: [AboutKey],
		queryFn: () => api.get("/about"),
		select: (response) => response,
	})
}

export function useUpdateAboutHero() {
	return useMutation({
		mutationKey: [AboutKey, "update"],
		mutationFn: async ({ ...data }: Partial<IAboutHero>) => {
			return api.put("/about", data)
		},
	})
}

export function useGetAboutContent() {
	return useQuery<any, AxiosError, IAboutContent>({
		initialData: { data: null },
		queryKey: [AboutContentKey],
		queryFn: () => api.get("/about/afritech54"),
		select: (response) => response,
	})
}

export function useUpdateAboutContent() {
	return useMutation({
		mutationKey: [AboutContentKey, "update"],
		mutationFn: async ({ ...data }: Partial<IAboutContent>) => {
			return api.put("/about/afritech54", data)
		},
	})
}
