import type { UserRepository } from "@application/repositories/user.repository"
import { User } from "@domain/user"
import path from "path"

import { FileSystemRepositoryHelper } from "./filesystem.repository.helper"

export class FileSystemUserRepository
	extends FileSystemRepositoryHelper<User, User["properties"]>
	implements UserRepository
{
	constructor(filePath: string = path.join(__dirname, "./user.filesystem.repository.json")) {
		super(
			filePath,
			(user) => user.properties,
			(properties) => User.fromProperties(properties.username, properties.password),
		)
	}

	public async save(user: User) {
		await this.saveOne(user)
	}

	public async getByUsername(username: string) {
		const users = await this.getAllEntities()
		return users.find((user) => user.properties.username === username) ?? null
	}
}
