import type { FollowRelationRepository } from "@application/repositories/follow-relations.repository"
import type { FollowRelation } from "@domain/follow-relation"

export class InMemoryFollowRelationRepository implements FollowRelationRepository {
	private _followRelations: Array<{
		follower: string
		followee: string
	}> = []

	public async save(followRelation: FollowRelation) {
		this._followRelations = [...this._followRelations, followRelation]
	}

	public setExistingFollowRelations(
		existingFollowRelations: Array<{
			follower: string
			followee: string
		}>,
	) {
		this._followRelations = existingFollowRelations
	}

	public async getFolloweesOf(user: string) {
		const followees = this._followRelations.filter((followRelation) => followRelation.follower === user)
		return followees.map((followRelation) => followRelation.followee)
	}
}
