import type { FollowRelationRepository } from "@application/repositories/follow-relations.repository"
import type { FollowRelation } from "@domain/follow-relation"

import { InMemoryEntityRepository } from "./inmemory.repository.helper"

export class InMemoryFollowRelationRepository
	extends InMemoryEntityRepository<FollowRelation>
	implements FollowRelationRepository
{
	public async save(followRelation: FollowRelation) {
		this.saveOne(followRelation)
	}

	public async remove(followRelationToRemove: FollowRelation) {
		this.removeByPredicate(
			(followRelation) =>
				followRelationToRemove.followee !== followRelation.followee ||
				followRelationToRemove.follower !== followRelation.follower,
		)
	}

	public setExistingFollowRelations(existingFollowRelations: FollowRelation[]) {
		this.setExisting(existingFollowRelations)
	}

	public async getFolloweesOf(user: string) {
		const followees = this.filterByPredicate((followRelation) => followRelation.follower === user)
		return followees.map((followRelation) => followRelation.followee)
	}
}
