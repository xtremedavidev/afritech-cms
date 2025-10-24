declare global {
	interface IBlog {
		_id: string
		id: string
		title: string
		status: "published" | "draft" | "archived"
		description: string
		body: string
		author: string
		tags: string[]
		coverImage?: string
		publishedAt?: string
		readTime?: number
		views?: number
		likes?: number
		slug: string
		seo?: {
			title: string
			description: string
			keywords: string[]
		}
		createdAt: string
		updatedAt: string
	}

	interface GetBlogsResponse {
		success: boolean
		data: IBlog[]
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

export const sampleBlogs = {
	success: true,
	data: [
		{
			_id: "507f1f77bcf86cd799439011",
			id: "507f1f77bcf86cd799439011",
			title: "Getting Started with React Development",
			description: "A comprehensive guide to start your journey with React development",
			body: "React is a powerful JavaScript library...",
			author: "John Doe",
			tags: ["react", "javascript", "frontend"],
			status: "published",
			coverImage: "https://jesulonimii.vercel.app/hero-2.png",
			publishedAt: "2024-01-15T10:30:00.000Z",
			readTime: 5,
			views: 150,
			likes: 25,
			slug: "getting-started-with-react-development",
			seo: {
				title: "React Development Guide - Complete Tutorial",
				description: "Learn React development from scratch",
				keywords: ["react", "javascript", "tutorial"],
			},
			createdAt: "2025-08-21T11:39:31.936Z",
			updatedAt: "2025-08-21T11:39:31.936Z",
		},
	],
	pagination: {
		page: 1,
		limit: 10,
		totalDocs: 100,
		totalPages: 10,
		hasNextPage: true,
		hasPrevPage: false,
	},
}
