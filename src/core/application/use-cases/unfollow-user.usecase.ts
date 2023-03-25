import type { FollowRelation } from "@domain/follow-relation"
import type { FollowRelationRepository } from "@application/repositories/follow-relations.repository"

export type UnfollowUserCommand = {
	follower: string
	followee: string
}

export class UnfollowUserUseCase {
	constructor(private readonly followRelationsRepository: FollowRelationRepository) {}

	async handle(command: UnfollowUserCommand) {
		const followees = await this.followRelationsRepository.getFolloweesOf(command.follower)
		if (!followees.includes(command.followee)) {
			throw new FollowRelationNotFoundError()
		}

		const followRelationToRemove: FollowRelation = {
			follower: command.follower,
			followee: command.followee,
		}
		await this.followRelationsRepository.remove(followRelationToRemove)
	}
}

export class FollowRelationNotFoundError extends Error {}
