import type { MessageRepository } from "@application/repositories/message.repository"
import type { Message } from "@domain/message"

import { InMemoryRepositoryHelper } from "./inmemory.repository.helper"

export class InMemoryMessageRepository extends InMemoryRepositoryHelper<Message> implements MessageRepository {
	public constructor() {
		super((message) => message.properties.id)
	}

	public async save(message: Message) {
		this.saveOne(message)
	}

	public setExistingMessages(existingMessages: Message[]) {
		this.setExisting(existingMessages)
	}

	public async getById(id: string) {
		return this.findByPredicate((message) => message.properties.id === id)
	}

	public async getByAuthor(author: string) {
		return this.filterByPredicate((message) => message.properties.author === author)
	}

	get messages() {
		return this.entities
	}
}
