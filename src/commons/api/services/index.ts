import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@utils/axiosProvider"
import { AxiosError } from "axios"
import { handleImageUpload } from "@commons/api/general"

const Key = "services"

export function useGetServices(params: Record<string, any> = {}, options: { enabled?: boolean } = {}) {
	params = { isActive: true, limit: 20, page: 1, ...params }

	const query = useQuery<any, AxiosError, GetServicesResponse>({
		initialData: { data: [] },
		queryKey: [Key, params],
		queryFn: () => api.get("/services", params, {}, false),
		select: (response) => response,
	})

	return {
		...query,
		data: query?.data?.data,
		stats: query?.data?.pagination,
		pages: query?.data?.pagination?.totalPages || 0,
	}
}

export function useCreateService() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [Key],
		mutationFn: async ({ files, ...data }: Partial<IService> & { files: Record<string, File> }) => {
			for (const key of Object.keys(files || {})) {
				data[key] = await handleImageUpload(files[key])
			}
			delete data.discountPercentage
			return api.post(`/services`, data)
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [Key] }),
	})
}

export function useGetService(id?: string) {
	return useQuery<any, AxiosError, IService>({
		initialData: { data: null },
		enabled: !!id,
		queryKey: [Key, id],
		queryFn: () => api.get(`/services/${id}`),
		select: (response) => response,
	})
}

export function useUpdateService(id: string) {
	return useMutation({
		mutationKey: [Key, "update"],
		mutationFn: async ({ files, ...data }: Partial<IService> & { files: Record<string, File> }) => {
			for (const key of Object.keys(files || {})) {
				data[key] = await handleImageUpload(files[key])
			}
			delete data.discountPercentage
			return api.put(`/services/${id}`, data)
		},
	})
}

export function useDeleteService(id?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [Key],
		mutationFn: () => api.delete(`/services/${id}`, {}),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [Key] }),
	})
}
