import { Timeline } from "@domain/timeline"
import type { TimelinePresenter } from "@application/presenters/timeline.presenter"
import type { FollowRelationRepository } from "@application/repositories/follow-relations.repository"
import type { MessageRepository } from "@application/repositories/message.repository"

export type ViewWallCommand = { user: string }

export class ViewWallUseCase {
	constructor(
		private readonly messageRepository: MessageRepository,
		private readonly followRelationRepository: FollowRelationRepository,
	) {}

	async handle(command: ViewWallCommand, wallPresenter: TimelinePresenter) {
		const followees = await this.followRelationRepository.getFolloweesOf(command.user)

		const messages = (
			await Promise.all([command.user, ...followees].map((user) => this.messageRepository.getByAuthor(user)))
		).flat()

		const wall = new Timeline(messages)

		wallPresenter.show(wall)
	}
}
