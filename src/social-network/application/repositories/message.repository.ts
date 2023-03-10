import type { Message } from "@domain/message"

export type MessageRepository = {
	save: (message: Message) => Promise<void>
}
