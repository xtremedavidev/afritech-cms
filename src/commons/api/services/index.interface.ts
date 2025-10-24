declare global {
	interface IService {
		_id: string
		id: string
		title: string
		description: string
		tools: string[]
		coverImage?: string
		supportImage?: string
		publishedAt?: string
		price: number
		discountPrice: number
		discountPercentage: number
		isActive: boolean
		inquiries: number
		views: number
		createdAt: string
		updatedAt: string
		seo?: {
			title: string
			description: string
			tags: string[]
		}
		slug: string
	}

	interface GetServicesResponse {
		success: boolean
		data: IService[]
		pagination: {
			page: number
			limit: number
			totalDocs: number
			totalPages: number
			hasNextPage: boolean
			hasPrevPage: boolean
		}
	}
}

export {}
