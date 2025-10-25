export type IHomeHero = {
	_id: string
	sectionTitle: string
	sectionSubtitle: string
	description: string
	companyDescription: string
	createdAt: string
	updatedAt: string
	type: string
}

export type IMetric = {
	_id: string
	title: string
	value: string
	description: string
	icon: string
	status: "draft" | "published"
	order: number
	slug: string
	createdAt: string
	updatedAt: string
}

export type GetMetricsResponse = {
	success: boolean
	data: IMetric[]
	pagination: {
		page: number
		limit: number
		totalDocs: number
		totalPages: number
		hasNextPage: boolean
		hasPrevPage: boolean
	}
}
