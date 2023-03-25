import * as fs from "fs/promises"
import path from "path"
import type { MessageRepository } from "@application/repositories/message.repository"
import { Message } from "@domain/message"

export class FileSystemMessageRepository implements MessageRepository {
	constructor(private readonly filePath: string = path.join(__dirname, "./messages.filesystem.repository.json")) {}

	public async save(message: Message) {
		const existingMessages = await this.getMessages()
		await this.saveMessages([...existingMessages, message.properties])
	}

	private async saveMessages(messages: Message["properties"][]) {
		await fs.writeFile(this.filePath, JSON.stringify(messages))
	}

	private async getMessages(): Promise<Message["properties"][]> {
		await this.initializeFile()
		const fileContent = await fs.readFile(this.filePath)
		return JSON.parse(fileContent.toString())
	}

	private async initializeFile() {
		try {
			await fs.access(this.filePath)
		} catch (err) {
			await fs.writeFile(this.filePath, JSON.stringify([]))
		}
	}

	public async getById(id: string) {
		const existingMessages = await this.getMessages()
		const matchingMessage = existingMessages.find((message) => message.id === id)

		if (!matchingMessage) {
			return null
		}

		return Message.from(
			matchingMessage.id,
			matchingMessage.author,
			matchingMessage.message,
			matchingMessage.publishedAt,
		)
	}

	public async getByAuthor(): Promise<Message[]> {
		return []
	}
}