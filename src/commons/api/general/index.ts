import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@utils/axiosProvider"
import { AxiosError } from "axios"
import { toast } from "sonner"

export function useUploadSingleImage() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (data: FormData) =>
			api.post("/upload/image", data, {
				"Content-Type": "multipart/form-data",
			}),
	})
}

export async function handleImageUpload(file: File) {
	const upload = (data: FormData) => api.post("/upload/image", data, {
		"Content-Type": "multipart/form-data",
	})
	const formData = new FormData()
	//append the image file to "image"
	formData.append("image", file)
	const response = await upload(formData)
	if (response?.url) {
		return response?.url
	} else {
		toast.error("Image upload failed:" + response?.message || "Unknown error")
		throw new Error("Image upload failed")
	}
}

export function useGetMetrics() {
	return useQuery<any, AxiosError, IDashboardMetrics>({
		queryKey: ["get-metrics"],
		queryFn: () => api.get("/metrics/dashboard"),
		select: (res) => res,
	})
}
