import { Timeline } from "@domain/timeline"
import type { TimelinePresenter } from "@application/presenters/timeline.presenter"
import type { MessageRepository } from "@application/repositories/message.repository"

export type ViewTimelineCommand = { user: string }

export class ViewTimelineUseCase {
	constructor(private readonly messageRepository: MessageRepository) {}

	async handle(command: ViewTimelineCommand, timelinePresenter: TimelinePresenter) {
		const messagesOfUser = await this.messageRepository.getByAuthor(command.user)

		const timeline = new Timeline(messagesOfUser)

		timelinePresenter.show(timeline)
	}
}
