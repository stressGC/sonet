import type { FollowRelationRepository } from "@application/repositories/follow-relations.repository"
import type { FollowRelation } from "@domain/follow-relation"

export type FollowUserCommand = {
	follower: string
	followee: string
}

export class FollowUserUseCase {
	constructor(private readonly followRelationsRepository: FollowRelationRepository) {}

	async handle(command: FollowUserCommand) {
		const followees = await this.followRelationsRepository.getFolloweesOf(command.follower)
		if (followees.includes(command.followee)) {
			throw new FollowRelationExistsError()
		}

		const followRelation: FollowRelation = {
			followee: command.followee,
			follower: command.follower,
		}
		await this.followRelationsRepository.save(followRelation)
	}
}

export class FollowRelationExistsError extends Error {}
