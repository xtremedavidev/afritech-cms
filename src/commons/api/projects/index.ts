import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@utils/axiosProvider"
import { AxiosError } from "axios"
import { handleImageUpload } from "@commons/api/general"

const Key = "projects"

export function useGetProjects(params: Record<string, any> = {}, options: { enabled?: boolean } = {}) {
	params = { status: "all", limit: 20, page: 1, ...params }

	const query = useQuery<any, AxiosError, GetProjectsResponse>({
		initialData: { data: [] },
		queryKey: [Key, params],
		queryFn: () => api.get("/projects", params, {}, false),
		select: (response) => response,
	})

	return {
		...query,
		data: query?.data?.data,
		stats: query?.data?.pagination,
		pages: query?.data?.pagination?.totalPages || 0,
	}
}

export function useCreateProject() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [Key],
		mutationFn: async ({ files, ...data }: IProject & { files: Record<string, File> }) => {
			for (const key of Object.keys(files || {})) {
				data[key] = await handleImageUpload(files[key])
			}

			return api.post("/projects", data)
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [Key] }),
	})
}

export function useGetProject(id?: string) {
	return useQuery<any, AxiosError, IProject>({
		initialData: { data: null },
		enabled: !!id,
		queryKey: [Key, id],
		queryFn: () => api.get(`/projects/${id}`),
		select: (response) => response,
	})
}

export function useUpdateProject(id: string) {
	return useMutation({
		mutationKey: [Key, "update"],
		mutationFn: async ({ files, ...data }: Partial<IProject> & { files: Record<string, File> }) => {
			for (const key of Object.keys(files || {})) {
				data[key] = await handleImageUpload(files[key])
			}
			return api.put(`/projects/${id}`, data)
		},
	})
}

export function useDeleteProject(id?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [Key],
		mutationFn: () => api.delete(`/projects/${id}`, {}),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [Key] }),
	})
}
