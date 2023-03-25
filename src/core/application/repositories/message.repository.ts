import type { Message } from "@domain/message"

export type MessageRepository = {
	save: (message: Message) => Promise<void>
	getById: (id: string) => Promise<Message | null>
	getByAuthor: (author: string) => Promise<Message[]>
}
