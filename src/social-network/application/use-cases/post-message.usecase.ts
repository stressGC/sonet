import type { DateProvider } from "@application/providers/date.provider"
import type { MessageRepository } from "@application/repositories/message.repository"

export type PostMessageCommand = { id: string; author: string; message: string }

export class PostMessageUseCase {
	constructor(private readonly messageRepository: MessageRepository, private readonly dateProvider: DateProvider) {}

	async handle(command: PostMessageCommand) {
		if (command.message.trim().length === 0) {
			throw new EmptyMessageError()
		}
		if (command.message.length > 280) {
			throw new MessageTooLongError()
		}

		await this.messageRepository.save({
			id: command.id,
			author: command.author,
			message: command.message,
			publishedAt: this.dateProvider.now(),
		})
	}
}

export class MessageTooLongError extends Error {}
export class EmptyMessageError extends Error {}
