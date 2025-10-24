export type IProcess = {
	_id: string
	processTitle: string
	description: string
	order: number
	slug: string
	createdAt: string
	updatedAt: string
}

export type GetProcessResponse = {
	success: boolean
	data: IProcess[]
	pagination: {
		page: number
		limit: number
		totalDocs: number
		totalPages: number
		hasNextPage: boolean
		hasPrevPage: boolean
	}
}
