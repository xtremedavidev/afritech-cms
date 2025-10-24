declare global {
	interface IDashboardMetrics {
		overview: {
			blogs: {
				total: number
				published: number
			}
			services: {
				total: number
				active: number
			}
			projects: {
				total: number
				published: number
			}
			team: {
				total: number
				active: number
			}
			tools: {
				total: number
				active: number
			}
		}
		recentActivity: {
			blogs: IBlog[]
			services: any[]
			projects: any[]
		}
	}
}

export {}
