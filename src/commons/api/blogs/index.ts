import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@utils/axiosProvider"
import { AxiosError } from "axios"
import { handleImageUpload } from "@commons/api/general"
import { toast } from "sonner"

const Key = "blogs"

export function useGetBlogs(params: Record<string, any> = {}, options: { enabled?: boolean } = {}) {
	params = { status: "all", limit: 20, page: 1, ...params }

	const query = useQuery<any, AxiosError, GetBlogsResponse>({
		initialData: { data: [] },
		queryKey: [Key, params],
		queryFn: () => api.get("/blogs", params, {}, false),
		select: (response) => response,
		...options,
	})

	return {
		...query,
		data: query?.data?.data as IBlog[],
		stats: query?.data?.pagination,
		pages: query?.data?.pagination?.totalPages || 0,
	}
}

export function useCreateBlog() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [Key],
		mutationFn: async ({ files, ...data }: IBlog & { files: Record<string, File> }) => {
			for (const key of Object.keys(files || {})) {
				data[key] = await handleImageUpload(files[key])
			}

			return api.post("/blogs", data)
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [Key] }),
	})
}

export function useGetBlog(id?: string) {
	return useQuery<any, AxiosError, IBlog>({
		enabled: !!id,
		queryKey: [Key, id],
		queryFn: () => api.get(`/blogs/${id}`),
		select: (response) => response,
	})
}

export function useUpdateBlog(id: string) {
	return useMutation({
		mutationKey: [Key, "update"],
		mutationFn: async ({ files, ...data }: Partial<IBlog> & { files: Record<string, File> }) => {
			for (const key of Object.keys(files || {})) {
				data[key] = await handleImageUpload(files[key])
			}
			return api.put(`/blogs/${id}`, data)
		},
	})
}

export function useDeleteBlog(id?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [Key],
		mutationFn: () => api.delete(`/blogs/${id}`, {}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [Key] })
			toast.success("Blog post deleted successfully")
		},
	})
}
