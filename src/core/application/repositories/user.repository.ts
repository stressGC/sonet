import type { User } from "@domain/user"

export type UserRepository = {
	save: (user: User) => Promise<void>
	getByUsername: (username: string) => Promise<User | null>
}
