import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@utils/axiosProvider"
import { AxiosError } from "axios"
import { IAboutHero } from "../about-us/index.interface"
import { GetMetricsResponse, IMetric } from "./index.interface"

const Key = "home"
const MetricsKey = "metrics"

type HeroType = "home" | "project" | "service" | "calltoaction"

export function useGetHero(type: HeroType) {
	return useQuery<any, AxiosError, IAboutHero>({
		initialData: { data: null },
		queryKey: [Key],
		queryFn: () => api.get(`/hero?type=${type}`),
		select: (response) => response,
	})
}

export function useUpdateHero(type: HeroType) {
	return useMutation({
		mutationKey: [Key, "update"],
		mutationFn: async ({ ...data }: Partial<IAboutHero>) => {
			return api.put("/hero", { ...data, type })
		},
	})
}

export function useGetMetrics(params: Record<string, any> = {}, options: { enabled?: boolean } = {}) {
	params = { status: "all", limit: 20, page: 1, ...params }

	const query = useQuery<any, AxiosError, GetMetricsResponse>({
		initialData: { data: [] },
		queryKey: [MetricsKey, params],
		queryFn: () => api.get("/metrics-cards", params, {}, false),
		select: (response) => response,
	})

	return {
		...query,
		data: query?.data?.data,
		stats: query?.data?.pagination,
		pages: query?.data?.pagination?.totalPages || 0,
	}
}

export function useCreateMetric() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [MetricsKey],
		mutationFn: async ({ ...data }: IMetric) => {
			return api.post("/metrics-cards", data)
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [MetricsKey] }),
	})
}

export function useGetMetric(id?: string) {
	return useQuery<any, AxiosError, IMetric>({
		initialData: { data: null },
		enabled: !!id,
		queryKey: [MetricsKey, id],
		queryFn: () => api.get(`/metrics-cards/${id}`),
		select: (response) => response,
	})
}

export function useUpdateMetric(id: string) {
	return useMutation({
		mutationKey: [MetricsKey, "update"],
		mutationFn: async ({ ...data }: Partial<IMetric>) => {
			return api.put(`/metrics-cards/${id}`, data)
		},
	})
}

export function useDeleteMetric(id?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [MetricsKey],
		mutationFn: () => api.delete(`/metrics-cards/${id}`, {}),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [MetricsKey] }),
	})
}
