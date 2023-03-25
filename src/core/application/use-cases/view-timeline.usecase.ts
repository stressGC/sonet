import type { DateProvider } from "@application/providers/date.provider"
import type { MessageRepository } from "@application/repositories/message.repository"
import { Timeline } from "@domain/timeline"

export type ViewTimelineCommand = { user: string }

export class ViewTimelineUseCase {
	constructor(private readonly messageRepository: MessageRepository, private readonly dateProvider: DateProvider) {}

	async handle(command: ViewTimelineCommand) {
		const messagesOfUser = await this.messageRepository.getByAuthor(command.user)

		const timeline = new Timeline(this.dateProvider, messagesOfUser)

		return timeline.format()
	}
}
