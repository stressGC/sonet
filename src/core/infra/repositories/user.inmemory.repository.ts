import type { UserRepository } from "@application/repositories/user.repository"
import type { User } from "@domain/user"

import { InMemoryRepositoryHelper } from "./inmemory.repository.helper"

export class InMemoryUserRepository extends InMemoryRepositoryHelper<User> implements UserRepository {
	public async save(user: User) {
		this.saveOne(user)
	}

	public async getByUsername(username: string) {
		return this.findByPredicate((user) => user.properties.username === username)
	}

	public setExistingUsers(users: User[]) {
		this.setExisting(users)
	}

	public get users() {
		return this.entities
	}
}
