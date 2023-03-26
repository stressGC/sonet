import type { DateProvider } from "@application/providers/date.provider"
import type { MessageRepository } from "@application/repositories/message.repository"
import { Message } from "@domain/message"

import type { UserRepository } from "./../repositories/user.repository"

export type PostMessageCommand = { id: string; username: string; password: string; message: string }

export class PostMessageUseCase {
	constructor(
		private readonly messageRepository: MessageRepository,
		private readonly userRepository: UserRepository,
		private readonly dateProvider: DateProvider,
	) {}

	async handle(command: PostMessageCommand) {
		const user = await this.userRepository.getByUsername(command.username)
		if (!user || user.properties.password !== command.password) {
			throw new UnauthorizedActionError()
		}

		const message = Message.from(command.id, user.properties.username, command.message, this.dateProvider.now())

		await this.messageRepository.save(message)
	}
}

export class UnauthorizedActionError extends Error {}
