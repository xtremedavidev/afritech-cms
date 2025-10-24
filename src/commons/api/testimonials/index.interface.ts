declare global {
	interface ITestimonial {
		_id: string
		userImage: string
		username: string
		userPosition: string
		message: string
		testimonialLink: string
		status: "published" | "draft" | "archived"
		order: number
		slug: string
		createdAt: string
		updatedAt: string
	}

	interface GetTestimonialsResponse {
		success: boolean
		data: ITestimonial[]
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
