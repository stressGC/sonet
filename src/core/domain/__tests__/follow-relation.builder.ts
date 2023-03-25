import type { FollowRelation } from "@domain/follow-relation"

const defaultFollowRelation: FollowRelation = {
	followee: "Henri",
	follower: "Brice",
}

export function followRelationBuilder(_followRelation?: Partial<FollowRelation>) {
	const followRelation: FollowRelation = {
		...defaultFollowRelation,
		..._followRelation,
	}
	return {
		whereUser(follower: string) {
			return followRelationBuilder({
				...followRelation,
				follower,
			})
		},
		follows(followee: string) {
			return followRelationBuilder({
				...followRelation,
				followee,
			})
		},
		build(): FollowRelation {
			return followRelation
		},
	}
}
