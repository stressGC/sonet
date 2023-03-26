import type { MessageRepository } from "@application/repositories/message.repository"
import { MessageNotFoundError } from "@domain/message"

export type EditMessageCommand = { id: string; message: string }

export class EditMessageUseCase {
	constructor(private readonly messageRepository: MessageRepository) {}

	async handle(command: EditMessageCommand) {
		const message = await this.messageRepository.getById(command.id)

		if (!message) {
			throw new MessageNotFoundError()
		}

		message.editMessage(command.message)

		await this.messageRepository.save(message)
	}
}
