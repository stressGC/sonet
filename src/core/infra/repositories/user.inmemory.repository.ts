import type { UserRepository } from "@application/repositories/user.repository"
import type { User } from "@domain/user"

export class InMemoryUserRepository implements UserRepository {
	private _users: User[] = []

	public async save(user: User) {
		this._users = [...this._users, user]
	}

	public get users() {
		return this._users
	}

	public setExistingUsers(users: User[]) {
		this._users = users
	}
}
