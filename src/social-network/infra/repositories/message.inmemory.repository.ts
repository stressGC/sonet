import type { MessageRepository } from "@application/repositories/message.repository"
import type { Message } from "@domain/message"

export class InMemoryMessageRepository implements MessageRepository {
	private _messagesById = new Map<string, Message>()

	public async save(message: Message) {
		this._messagesById.set(message.properties.id, message)
	}

	public setExistingMessages(existingMessages: Message[]) {
		existingMessages.forEach((message) => {
			this.save(message)
		})
	}

	public async getById(id: string) {
		return this._messagesById.get(id) ?? null
	}

	public async getByAuthor(author: string) {
		return this.messages.filter((message) => message.properties.author === author)
	}

	get messages() {
		return Array.from(this._messagesById.values())
	}
}
