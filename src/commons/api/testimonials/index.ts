import { handleImageUpload } from "@commons/api/general"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@utils/axiosProvider"
import { AxiosError } from "axios"

const Key = "testimonials"

export function useGetTestimonials(params: Record<string, any> = {}, options: { enabled?: boolean } = {}) {
	params = { status: "all", limit: 20, page: 1, ...params }

	const query = useQuery<any, AxiosError, GetTestimonialsResponse>({
		initialData: { data: [] },
		queryKey: [Key, params],
		queryFn: () => api.get("/testimonials", params, {}, false),
		select: (response) => response,
	})

	return {
		...query,
		data: query?.data?.data,
		stats: query?.data?.pagination,
		pages: query?.data?.pagination?.totalPages || 0,
	}
}

export function useCreateTestimonial() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [Key],
		mutationFn: async ({ files, ...data }: ITestimonial & { files: Record<string, File> }) => {
			for (const key of Object.keys(files || {})) {
				data[key] = await handleImageUpload(files[key])
			}

			return api.post("/testimonials", data)
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [Key] }),
	})
}

export function useGetTestimonial(id?: string) {
	return useQuery<any, AxiosError, ITestimonial>({
		initialData: { data: null },
		enabled: !!id,
		queryKey: [Key, id],
		queryFn: () => api.get(`/testimonials/${id}`),
		select: (response) => response,
	})
}

export function useUpdateTestimonial(id: string) {
	return useMutation({
		mutationKey: [Key, "update"],
		mutationFn: async ({ files, ...data }: Partial<ITestimonial> & { files: Record<string, File> }) => {
			for (const key of Object.keys(files || {})) {
				data[key] = await handleImageUpload(files[key])
			}
			return api.put(`/testimonials/${id}`, data)
		},
	})
}

export function useDeleteTestimonial(id?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [Key],
		mutationFn: () => api.delete(`/testimonials/${id}`, {}),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [Key] }),
	})
}
