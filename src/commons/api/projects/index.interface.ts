declare global {
	interface IProject {
		_id: string
		id: string
		title: string
		status: "published" | "draft" | "archived"
		description: string
		body: string
		tags: string[]
		tools: string[]
		duration?: number
		coverImage?: string
		publishedAt?: string
		createdAt: string
		updatedAt: string
		seo?: {
			title: string
			description: string
			keywords: string[]
		}
		projectUrl?: string
		liveUrl?: string
		startDate?: string
		endDate?: string
		isFeatured?: boolean
		slug: string
	}

	interface GetProjectsResponse {
		success: boolean
		data: IProject[]
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

