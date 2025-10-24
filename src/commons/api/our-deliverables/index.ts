import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@utils/axiosProvider"
import { AxiosError } from "axios"
import { GetDeliverablesResponse, IDeliverable, IDeliverableHero } from "./index.interface"

const Key = "deliverables"
const TableKey = "our-deliverables"

export function useGetDeliverablesHero() {
	return useQuery<any, AxiosError, IDeliverableHero>({
		initialData: { data: null },
		queryKey: [Key],
		queryFn: () => api.get("/hero?type=deliverables"),
		select: (response) => response,
	})
}

export function useUpdateDeliverablesHero() {
	return useMutation({
		mutationKey: [Key, "update"],
		mutationFn: async ({ ...data }: Partial<IDeliverableHero>) => {
			return api.put("/hero", { ...data, type: "deliverables" })
		},
	})
}

export function useGetDeliverables(params: Record<string, any> = {}, options: { enabled?: boolean } = {}) {
	params = { status: "all", limit: 20, page: 1, ...params }

	const query = useQuery<any, AxiosError, GetDeliverablesResponse>({
		initialData: { data: [] },
		queryKey: [TableKey, params],
		queryFn: () => api.get("/deliverables", params, {}, false),
		select: (response) => response,
	})

	return {
		...query,
		data: query?.data?.data,
		stats: query?.data?.pagination,
		pages: query?.data?.pagination?.totalPages || 0,
	}
}

export function useCreateDeliverable() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [TableKey],
		mutationFn: async ({ ...data }: Partial<IDeliverable>) => {
			return api.post("/deliverables", data)
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [TableKey] }),
	})
}

export function useGetDeliverable(id?: string) {
	return useQuery<any, AxiosError, IDeliverable>({
		initialData: { data: null },
		enabled: !!id,
		queryKey: [TableKey, id],
		queryFn: () => api.get(`/deliverables/${id}`),
		select: (response) => response,
	})
}

export function useUpdateDeliverable(id: string) {
	return useMutation({
		mutationKey: [TableKey, "update"],
		mutationFn: async ({ ...data }: Partial<IDeliverable>) => {
			return api.put(`/deliverables/${id}`, data)
		},
	})
}

export function useDeleteDeliverable(id?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [TableKey],
		mutationFn: () => api.delete(`/deliverables/${id}`, {}),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [TableKey] }),
	})
}
