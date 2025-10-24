declare global {
	interface IAuthData extends IUser {}

	interface IUser {
		username: string
		email: string
		firstName: string
		lastName: string
		fullName: string
		isActive: true
		lastLogin: string
		createdAt: string
		updatedAt: string
		isLocked: boolean
		id: string
		loginAttempts: number
		lockUntil: string | null
		_id: string
	}
}

export {}

