export type ICallToAction = {
	_id: string
	title: string
	description: string
	status: "draft" | "published"
	order: number
	slug: string
	createdAt: string
	updatedAt: string
}

export type GetCTAResponse = {
	success: boolean
	data: ICallToAction[]
	pagination: {
		page: number
		limit: number
		totalDocs: number
		totalPages: number
		hasNextPage: boolean
		hasPrevPage: boolean
	}
}
