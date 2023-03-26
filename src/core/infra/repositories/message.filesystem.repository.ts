import type { MessageRepository } from "@application/repositories/message.repository"
import { Message } from "@domain/message"
import path from "path"

import { FileSystemEntityRepository } from "./filesystem.repository.helper"

type PersistedMessage = {
	id: string
	author: string
	message: string
	publishedAt: string
}

export class FileSystemMessageRepository
	extends FileSystemEntityRepository<Message, PersistedMessage>
	implements MessageRepository
{
	constructor(filePath: string = path.join(__dirname, "./user.filesystem.repository.json")) {
		super(
			filePath,
			(message) => ({
				id: message.properties.id,
				author: message.properties.author,
				message: message.properties.message,
				publishedAt: message.properties.publishedAt.toISOString(),
			}),
			(persistedMessage) =>
				Message.from(
					persistedMessage.id,
					persistedMessage.author,
					persistedMessage.message,
					new Date(persistedMessage.publishedAt),
				),
		)
	}

	public async save(message: Message) {
		await this.saveOne(message)
	}

	public async getById(id: string) {
		const existingMessages = await this.getAllEntities()
		return existingMessages.find((message) => message.properties.id === id) ?? null
	}

	public async getByAuthor(author: string): Promise<Message[]> {
		const messages = await this.getAllEntities()
		return messages.filter((message) => message.properties.author === author)
	}
}
