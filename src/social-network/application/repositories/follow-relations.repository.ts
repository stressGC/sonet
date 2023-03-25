import type { FollowRelation } from "@domain/follow-relation"

export type FollowRelationsRepository = {
	save: (followRelation: FollowRelation) => Promise<void>
	getFolloweesOf: (user: string) => Promise<string[]>
}
