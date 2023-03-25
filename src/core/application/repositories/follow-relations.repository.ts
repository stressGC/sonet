import type { FollowRelation } from "@domain/follow-relation"

export type FollowRelationRepository = {
	save: (followRelation: FollowRelation) => Promise<void>
	remove: (followRelation: FollowRelation) => Promise<void>
	getFolloweesOf: (user: string) => Promise<string[]>
}
