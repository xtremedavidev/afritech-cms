import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "@utils/axiosProvider"
import { AxiosError } from "axios"
import { GetCTAResponse, ICallToAction } from "./index.interface"

const Key = "call-to-action"

export function useGetCTA(params: Record<string, any> = {}, options: { enabled?: boolean } = {}) {
	params = { status: "all", limit: 20, page: 1, ...params }

	const query = useQuery<any, AxiosError, GetCTAResponse>({
		initialData: { data: [] },
		queryKey: [Key, params],
		queryFn: () => api.get("/cta", params, {}, false),
		select: (response) => response,
	})

	return {
		...query,
		data: query?.data?.data,
		stats: query?.data?.pagination,
		pages: query?.data?.pagination?.totalPages || 0,
	}
}

export function useUpdateCTA(id: string) {
	return useMutation({
		mutationKey: [Key, "update", id],
		mutationFn: async (data: { title: string; description: string; status: "draft" | "published" }) => {
			const payload = {
				...data,
				order: 0
			}
			return api.post(`/cta`, payload)
		},
	})
}
