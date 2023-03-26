import { userBuilder } from "@domain/__tests__/user.builder"
import * as fs from "fs/promises"
import path from "path"

import { FileSystemUserRepository } from "../user.filesystem.repository"

const testFollowRelationsPath = path.join(__dirname, "./user.test.filesystem.repository.json")

describe("FileSystemUserRepository", () => {
	beforeEach(async () => {
		await fs.writeFile(testFollowRelationsPath, JSON.stringify([]))
	})

	it("saves a user to the file system", async () => {
		const fileSystemUserRepository = new FileSystemUserRepository(testFollowRelationsPath)

		await fileSystemUserRepository.save(userBuilder().withUsername("bobby").withPassword("password").build())

		const fileContent = await fs.readFile(testFollowRelationsPath)
		const fileSystemFollowRelations = JSON.parse(fileContent.toString())
		expect(fileSystemFollowRelations).toStrictEqual([
			{
				username: "bobby",
				password: "password",
			},
		])
	})

	it("saves two users to the file system in a row", async () => {
		const fileSystemUserRepository = new FileSystemUserRepository(testFollowRelationsPath)

		await fileSystemUserRepository.save(userBuilder().withUsername("bobby").withPassword("password").build())

		await fileSystemUserRepository.save(userBuilder().withUsername("alice").withPassword("otherpassword").build())

		const fileContent = await fs.readFile(testFollowRelationsPath)
		const fileSystemFollowRelations = JSON.parse(fileContent.toString())
		expect(fileSystemFollowRelations).toStrictEqual([
			{
				username: "bobby",
				password: "password",
			},
			{
				username: "alice",
				password: "otherpassword",
			},
		])
	})

	it("retrieves a user by username", async () => {
		const fileSystemUserRepository = new FileSystemUserRepository(testFollowRelationsPath)
		await fileSystemUserRepository.save(userBuilder().withUsername("bobby").withPassword("password").build())

		const user = await fileSystemUserRepository.getByUsername("bobby")

		expect(user).toStrictEqual(userBuilder().withUsername("bobby").withPassword("password").build())
	})
})
