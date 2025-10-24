import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "@utils/axiosProvider"
import { AxiosError } from "axios"
import { IAboutHero } from "../about-us/index.interface"
import { IContactReceiverEmail } from "./index.interface"

const ContactKey = "contact"
const ContactReceiverKey = "contact/receiver-email"

export function useGetContactHero() {
	return useQuery<any, AxiosError, IAboutHero>({
		initialData: { data: null },
		queryKey: [ContactKey],
		queryFn: () => api.get("/contact"),
		select: (response) => response,
	})
}

export function useUpdateContactHero() {
	return useMutation({
		mutationKey: [ContactKey, "update"],
		mutationFn: async ({ ...data }: Partial<IAboutHero>) => {
			return api.put("/contact", data)
		},
	})
}

export function useGetContactEmail() {
	return useQuery<any, AxiosError, IContactReceiverEmail>({
		initialData: { data: null },
		queryKey: [ContactReceiverKey],
		queryFn: () => api.get("/contact/receiver-email"),
		select: (response) => response,
	})
}

export function useUpdateContactEmail() {
	return useMutation({
		mutationKey: [ContactReceiverKey, "update"],
		mutationFn: async ({ ...data }: Partial<IContactReceiverEmail>) => {
			return api.put("/contact/receiver-email", data)
		},
	})
}
