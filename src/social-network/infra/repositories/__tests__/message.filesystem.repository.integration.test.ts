import { messageBuilder } from "@domain/__tests__/message.builder"
import { FileSystemMessageRepository } from "@infra/repositories/message.filesystem.repository"
import * as fs from "fs/promises"
import path from "path"

const testMessagesPath = path.join(__dirname, "./messages.test.filesystem.repository.json")

describe.skip("FileSystemMessageRepository", () => {
	beforeEach(async () => {
		await fs.writeFile(testMessagesPath, JSON.stringify([]))
	})

	it("saves a message to the file system", async () => {
		const fileSystemMessageRepository = new FileSystemMessageRepository(testMessagesPath)

		await fileSystemMessageRepository.save(
			messageBuilder()
				.authoredBy("Georges")
				.withId("message_1")
				.publishedAt(new Date("15 Jan 2022"))
				.withMessage("Test message")
				.build(),
		)

		const fileContent = await fs.readFile(testMessagesPath)
		const fileSystemMessages = JSON.parse(fileContent.toString())
		expect(fileSystemMessages).toStrictEqual([
			{
				id: "message_1",
				publishedAt: "2022-01-14T23:00:00.000Z",
				message: "Test message",
				author: "Georges",
			},
		])
	})

	it("saves two messages to the file system in a row", async () => {
		const fileSystemMessageRepository = new FileSystemMessageRepository(testMessagesPath)

		await fileSystemMessageRepository.save(
			messageBuilder()
				.authoredBy("Georges")
				.withId("message_1")
				.publishedAt(new Date("15 Jan 2022"))
				.withMessage("Test message")
				.build(),
		)

		await fileSystemMessageRepository.save(
			messageBuilder()
				.authoredBy("Georges")
				.withId("message_2")
				.publishedAt(new Date("16 Jan 2022"))
				.withMessage("Second message")
				.build(),
		)

		const fileContent = await fs.readFile(testMessagesPath)
		const fileSystemMessages = JSON.parse(fileContent.toString())
		expect(fileSystemMessages).toStrictEqual([
			{
				id: "message_1",
				publishedAt: "2022-01-14T23:00:00.000Z",
				message: "Test message",
				author: "Georges",
			},
			{
				id: "message_2",
				publishedAt: "2022-01-15T23:00:00.000Z",
				message: "Second message",
				author: "Georges",
			},
		])
	})
})
