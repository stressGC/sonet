import type { MessageRepository } from "@application/repositories/message.repository"
import type { Message } from "@domain/message"

export class InMemoryMessageRepository implements MessageRepository {
	private _messages: Message[] = []

	public async save(message: Message) {
		this._messages = [...this._messages, message]
	}

	public setExistingMessages(existingMessages: Message[]) {
		this._messages = existingMessages
	}

	get messages() {
		return this._messages
	}
}
