import { handleImageUpload } from "@commons/api/general"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@utils/axiosProvider"
import { AxiosError } from "axios"
import { GetProcessResponse, IProcess } from "./index.interface"

const Key = "process"

export function useGetProcesses(params: Record<string, any> = {}, options: { enabled?: boolean } = {}) {
	params = { status: "all", limit: 20, page: 1, ...params }

	const query = useQuery<any, AxiosError, GetProcessResponse>({
		initialData: { data: [] },
		queryKey: [Key, params],
		queryFn: () => api.get("/processes", params, {}, false),
		select: (response) => response,
	})

	return {
		...query,
		data: query?.data?.data,
		stats: query?.data?.pagination,
		pages: query?.data?.pagination?.totalPages || 0,
	}
}

export function useCreateProcess() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [Key],
		mutationFn: async ({ files, ...data }: IProcess & { files: Record<string, File> }) => {
			for (const key of Object.keys(files || {})) {
				data[key] = await handleImageUpload(files[key])
			}

			return api.post("/processes", data)
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [Key] }),
	})
}

export function useGetProcess(id?: string) {
	return useQuery<any, AxiosError, IProcess>({
		initialData: { data: null },
		enabled: !!id,
		queryKey: [Key, id],
		queryFn: () => api.get(`/processes/${id}`),
		select: (response) => response,
	})
}

export function useUpdateProcess(id: string) {
	return useMutation({
		mutationKey: [Key, "update"],
		mutationFn: async ({ ...data }: Partial<IProcess>) => {
			return api.put(`/processes/${id}`, data)
		},
	})
}

export function useDeleteProcess(id?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [Key],
		mutationFn: () => api.delete(`/processes/${id}`, {}),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [Key] }),
	})
}
