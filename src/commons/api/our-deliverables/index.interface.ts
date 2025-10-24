export type IDeliverableHero = {
	_id: string
	sectionTitle: string
	sectionSubtitle: string
	description: string
	createdAt: string
	updatedAt: string
}

export type IDeliverable = {
	_id: string
	sectionTitle: string
	description: string
	status: "draft" | "published"
	order: number
	slug: string
	createdAt: string
	updatedAt: string
}

export type GetDeliverablesResponse = {
	success: boolean
	data: IDeliverable[]
	pagination: {
		page: number
		limit: number
		totalDocs: number
		totalPages: number
		hasNextPage: boolean
		hasPrevPage: boolean
	}
}
