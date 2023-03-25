import { followRelationBuilder } from "@domain/__tests__/follow-relation.builder"
import * as fs from "fs/promises"
import path from "path"
import { FileSystemFollowRelationRepository } from "../follow-relation.filesystem.repository"

const testFollowRelationsPath = path.join(__dirname, "./follow-relation.test.filesystem.repository.json")

describe("FileSystemFollowRelationRepository", () => {
	beforeEach(async () => {
		await fs.writeFile(testFollowRelationsPath, JSON.stringify([]))
	})

	it("saves a follow relation to the file system", async () => {
		const fileSystemFollowRelationRepository = new FileSystemFollowRelationRepository(testFollowRelationsPath)

		await fileSystemFollowRelationRepository.save(followRelationBuilder().whereUser("Bob").follows("Alice").build())

		const fileContent = await fs.readFile(testFollowRelationsPath)
		const fileSystemFollowRelations = JSON.parse(fileContent.toString())
		expect(fileSystemFollowRelations).toStrictEqual([
			{
				follower: "Bob",
				followee: "Alice",
			},
		])
	})

	it("saves two follow relations to the file system in a row", async () => {
		const fileSystemFollowRelationRepository = new FileSystemFollowRelationRepository(testFollowRelationsPath)

		await fileSystemFollowRelationRepository.save(followRelationBuilder().whereUser("Bob").follows("Alice").build())

		await fileSystemFollowRelationRepository.save(
			followRelationBuilder().whereUser("Bob").follows("Charlie").build(),
		)

		const fileContent = await fs.readFile(testFollowRelationsPath)
		const fileSystemFollowRelations = JSON.parse(fileContent.toString())
		expect(fileSystemFollowRelations).toStrictEqual([
			{
				follower: "Bob",
				followee: "Alice",
			},
			{
				follower: "Bob",
				followee: "Charlie",
			},
		])
	})
})
