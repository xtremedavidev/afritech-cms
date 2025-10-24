declare global {
	interface ITeamMember {
		_id: string
		id: string
		fullName: string
		tools: string[]
		profileImage?: string
		roleTitle: string
		roleDescription: string
		phone?: string
		email?: string
		address?: string
		socials: { name: string; url: string }[]
		bio: string
		order: number
		joinDate: string
		isActive: boolean
		createdAt: string
		updatedAt: string
		slug: string
	}

	interface GetTeamResponse {
		success: boolean
		data: ITeamMember[]
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
