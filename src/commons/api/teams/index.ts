import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@utils/axiosProvider"
import { AxiosError } from "axios"
import { handleImageUpload } from "@commons/api/general"

const Key = "teams"

export function useGetTeam(params: Record<string, any> = {}, options: { enabled?: boolean } = {}) {
	params = { isActive: true, limit: 20, page: 1, ...params }

	const query = useQuery<any, AxiosError, GetTeamResponse>({
		initialData: { data: [] },
		queryKey: [Key, params],
		queryFn: () => api.get("/teams", params, {}, false),
		select: (response) => response,
	})

	return {
		...query,
		data: query?.data?.data,
		stats: query?.data?.pagination,
		pages: query?.data?.pagination?.totalPages || 0,
	}
}

export function useCreateTeamMember() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [Key],
		mutationFn: async ({ files, ...data }: Partial<ITeamMember> & { files: Record<string, File> }) => {
			for (const key of Object.keys(files || {})) {
				data[key] = await handleImageUpload(files[key])
			}
			return api.post(`/teams`, data)
		},

		onSuccess: () => queryClient.invalidateQueries({ queryKey: [Key] }),
	})
}

export function useGetTeamMember(id?: string) {
	return useQuery<any, AxiosError, ITeamMember>({
		initialData: { data: null },
		enabled: !!id,
		queryKey: [Key, id],
		queryFn: () => api.get(`/teams/${id}`),
		select: (response) => response,
	})
}

export function useUpdateTeamMember(id: string) {
	return useMutation({
		mutationKey: [Key, "update"],
		mutationFn: async ({ files, ...data }: Partial<ITeamMember> & { files: Record<string, File> }) => {
			for (const key of Object.keys(files || {})) {
				data[key] = await handleImageUpload(files[key])
			}
			return api.put(`/teams/${id}`, data)
		},
	})
}

export function useDeleteTeamMember(id?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [Key],
		mutationFn: () => api.delete(`/teams/${id}`, {}),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [Key] }),
	})
}
