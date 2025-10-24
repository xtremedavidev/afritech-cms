import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@utils/axiosProvider"
import { AxiosError } from "axios"
import { samplePeople } from "@commons/api/people/index.interface"

const Key = "people"

export function useGetPeople(params: Record<string, any> = {}, options: { enabled?: boolean } = {}) {
	const query = useQuery<any, AxiosError, GetPeopleResponse>({
		initialData: { data: samplePeople },
		queryKey: [Key, params],
		queryFn: () => api.get("/people", params),
		select: (response) => response.data,
	})

	return {
		...query,
		data: query?.data?.data,
		stats: query?.data?.pagination,
		pages: query?.data?.pagination?.totalPages || 0,
	}
}

export function useGetPeopleTags(options: { enabled?: boolean } = {}) {
	//create a cache key based on the params
	return useQuery<any, AxiosError, IPeople["tags"]>({
		initialData: { data: [] },
		queryKey: [Key, "categories"],
		queryFn: () => api.get("/blog/categories"),
		select: (response) => response?.data,
		...options,
	})
}

export function useCreatePerson() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [Key],
		mutationFn: (data: IPeople) => api.post("/blog", data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [Key] }),
	})
}

export function useGetPerson(id?: string) {
	return useQuery<any, AxiosError, IPeople>({
		initialData: { data: samplePeople?.data?.[0] },
		enabled: !!id,
		queryKey: [Key, id],
		queryFn: () => api.get(`/blog/${id}`),
		select: (response) => response?.data,
	})
}

export function useUpdatePerson(id: string) {
	return useMutation({
		mutationKey: [Key, "update"],
		mutationFn: (data: IPeople) => api.put(`/blog/${id}`, data),
	})
}

export function useDeletePerson(id?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [Key],
		mutationFn: () => api.delete(`/blog/${id}`, {}),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [Key] }),
	})
}
