import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@utils/axiosProvider"
import { AxiosError } from "axios"
import { IFooterLinks } from "./index.interface"

const Key = "socials"

export function useGetSocialLinks() {
	return useQuery<any, AxiosError, IFooterLinks>({
		initialData: { data: null },
		queryKey: [Key],
		queryFn: () => api.get("/social-links"),
		select: (response) => response,
	})
}

export function useUpdateSocialLink() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: [Key, "update"],
		mutationFn: async ({ ...data }: Partial<IFooterLinks>) => {
			return api.put("/social-links", data)
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [Key] }),
	})
}
