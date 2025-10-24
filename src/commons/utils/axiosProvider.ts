import axios, { AxiosError } from "axios"
import Keys from "@utils/query-keys"
import { toast } from "sonner"

enum API_URLS {
	BUSINESS = import.meta.env.VITE_BASE_URL,
}

const axiosInstance = axios.create({
	//baseURL: API_URL,
})

let token: string

if (localStorage.getItem(Keys.access_token)) {
	axiosInstance.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(Keys.access_token)}`
	axiosInstance.defaults.headers.Authorization = `Bearer ${localStorage.getItem(Keys.access_token)}`
}

export const updateAuthToken = async (new_token: string, save?: boolean) => {
	token = new_token

	if (save) {
		localStorage.setItem(Keys.access_token, new_token)
	}
	axiosInstance.defaults.headers.common.Authorization = "Bearer " + new_token
	axiosInstance.defaults.headers.Authorization = "Bearer " + new_token
}

axiosInstance.interceptors.request.use(
	async (config) => {
		/*const fetch_token = await SecureStore.getItemAsync("access-token")
		if (fetch_token) {
			await updateAuthToken(fetch_token)
		}
*/
		return config
	},
	(error) => {
		return Promise.reject(error)
	},
)

axiosInstance.interceptors.response.use(
	(response) => {
		//console.log(response.data)
		return response.data
	},
	(error: AxiosError) => {
		console.error(error?.toString())

		return Promise.reject(error)
	},
)

const makeRequest = async ({
	method,
	path,
	data = null,
	headers = {},
	API_URL,
	select = true,
}: {
	method: "get" | "post" | "patch" | "put" | "delete"
	path: string
	data: any
	headers: any
	API_URL: string
	select: boolean
}) => {
	const endpoint = path ? `${API_URL}${path.charAt(0) === "/" ? "" : "/"}${path}` : null
	if (!endpoint) {
		console.error("API request error: No endpoint provided")
		throw new Error("API request error: No endpoint provided")
	}

	let config: IAxiosRequestConfig = {
		method: method,
		url: endpoint,
		data: data,
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
	}

	if (method !== "get" && data) {
		config.data = data
	} else {
		if (data) {
			const params = new URLSearchParams(data).toString()
			// append the params to the url, handle a situation where config.url already has params
			config.url = `${config.url}${config.url.includes("?") ? "&" : "?"}${params}`
		}
	}

	console.debug(
		`🚀 Requesting Api: %c${config.method.toUpperCase()} ===> %c${config?.url}\n`,
		"color: yellow",
		"color: yellow",
	)

	return await axiosInstance(config)
		.then((res) => {
			console.log(res)
			return select ? res?.data : res
		})
		.catch((err: AxiosError) => {
			return Promise.reject(err)
		})
}

enum Gateways {
	BUSINESS = "BUSINESS",
	CURRENCY = "CURRENCY",
}

function resolveApiUrl(gateway: Gateways) {
	return API_URLS[gateway] as unknown as string
}

function createAPI(gateway: Gateways) {
	const API_URL = resolveApiUrl(gateway)

	const shouldSelectData = true
	return {
		get: async (path: string, data: any = null, headers: any = {}, select: boolean = shouldSelectData) =>
			await makeRequest({
				method: "get",
				path,
				data,
				headers,
				API_URL,
				select: select,
			}),
		post: async (path: string, data: any, headers: any = {}, select: boolean = shouldSelectData) =>
			await makeRequest({
				method: "post",
				path,
				data,
				headers,
				API_URL,
				select,
			}),
		patch: async (path: string, data: any, headers: any = {}, select: boolean = shouldSelectData) =>
			await makeRequest({
				method: "patch",
				path,
				data,
				headers,
				API_URL,
				select,
			}),
		put: async (path: string, data: any, headers: any = {}, select: boolean = shouldSelectData) =>
			await makeRequest({
				method: "put",
				path,
				data,
				headers,
				API_URL,
				select,
			}),
		delete: async (path: string, data: any, headers: any = {}, select: boolean = shouldSelectData) =>
			await makeRequest({
				method: "delete",
				path,
				data,
				headers,
				API_URL,
				select,
			}),
	}
}

export const api = createAPI(Gateways.BUSINESS)
export const CurrencyGateway = createAPI(Gateways.CURRENCY)

interface IAxiosRequestConfig {
	method: "get" | "post" | "patch" | "put" | "delete"
	url: string
	headers: any
	data?: any
}

export const handleApiError = (error: AxiosError) => {
	let message = "An unexpected error occurred. Please try again later."
	console.error(error)
	if ((error.response?.data as any)?.message) {
		message = (error.response?.data as any)?.message
	}

	if (error.response?.status === 401) {
	}

	if (error.response?.status !== 401) toast.error(message)
}

export function mockApiCall<T>(data: T, time = 1000, status: number = 200): Promise<T> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (status.toString().startsWith("4") || status.toString().startsWith("5")) {
				reject({
					status: status,
					message: "error",
					data: data,
				})
			} else {
				resolve(data)
			}
		}, time)
	})
}

export default axiosInstance
