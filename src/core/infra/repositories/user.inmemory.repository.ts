import type { UserRepository } from "@application/repositories/user.repository"
import type { User } from "@domain/user"

export class InMemoryUserRepository implements UserRepository {
	private _users: User[] = []

	public async save(user: User) {
		this._users = [...this._users, user]
	}

	public async getByUsername(username: string) {
		return this._users.find((user) => user.properties.username === username) ?? null
	}

	public get users() {
		return this._users
	}

	public setExistingUsers(users: User[]) {
		this._users = users
	}
}
