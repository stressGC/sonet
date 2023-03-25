import * as fs from "fs/promises"
import path from "path"
import { Message } from "@domain/message"
import { constants } from "fs"
import type { MessageRepository } from "@application/repositories/message.repository"

type PersistedMessage = {
	id: string
	author: string
	message: string
	publishedAt: string
}

export class FileSystemMessageRepository implements MessageRepository {
	constructor(private readonly filePath: string = path.join(__dirname, "./messages.filesystem.repository.json")) {}

	public async save(message: Message) {
		const existingMessages = await this.getMessages()
		await this.saveMessages([...existingMessages, message])
	}

	private async saveMessages(messages: Message[]) {
		const persistedMessages: PersistedMessage[] = messages.map((message) => ({
			id: message.properties.id,
			author: message.properties.author,
			message: message.properties.message,
			publishedAt: message.properties.publishedAt.toISOString(),
		}))
		await fs.writeFile(this.filePath, JSON.stringify(persistedMessages))
	}

	private async getMessages(): Promise<Message[]> {
		await this.initializeFile()
		const fileContent = await fs.readFile(this.filePath)
		const persistedMessages = JSON.parse(fileContent.toString()) as Array<PersistedMessage>
		return persistedMessages.map((persistedMessage) =>
			Message.from(
				persistedMessage.id,
				persistedMessage.author,
				persistedMessage.message,
				new Date(persistedMessage.publishedAt),
			),
		)
	}

	private async initializeFile() {
		try {
			await fs.access(this.filePath, constants.R_OK | constants.W_OK)
		} catch (err) {
			await fs.writeFile(this.filePath, JSON.stringify([]))
		}
	}

	public async getById(id: string) {
		const existingMessages = await this.getMessages()
		return existingMessages.find((message) => message.properties.id === id) ?? null
	}

	public async getByAuthor(author: string): Promise<Message[]> {
		const messages = await this.getMessages()
		return messages.filter((message) => message.properties.author === author)
	}
}
