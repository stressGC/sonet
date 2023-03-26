import type { DateProvider } from "@application/providers/date.provider"
import type { MessageRepository } from "@application/repositories/message.repository"
import { Message } from "@domain/message"

export type PostMessageCommand = { id: string; author: string; message: string }

export class PostMessageUseCase {
	constructor(private readonly messageRepository: MessageRepository, private readonly dateProvider: DateProvider) {}

	async handle(command: PostMessageCommand) {
		const message = Message.from(command.id, command.author, command.message, this.dateProvider.now())

		await this.messageRepository.save(message)
	}
}
