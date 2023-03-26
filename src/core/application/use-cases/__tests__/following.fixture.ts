import { InMemoryFollowRelationRepository } from "@infra/repositories/follow-relation.inmemory.repository"

import type { FollowUserCommand } from "../follow-user.usecase"
import { FollowUserUseCase } from "../follow-user.usecase"
import type { UnfollowUserCommand } from "../unfollow-user.usecase"
import { UnfollowUserUseCase } from "../unfollow-user.usecase"

export function createFollowingFixture() {
	const followRelationRepository = new InMemoryFollowRelationRepository()
	const followUserUseCase = new FollowUserUseCase(followRelationRepository)
	const unfollowUserUseCase = new UnfollowUserUseCase(followRelationRepository)
	let error: unknown

	return {
		givenNoExistingFollowRelations() {
			followRelationRepository.setExistingFollowRelations([])
		},
		givenExistingFollowRelations(
			existingFollowRelations: Array<{
				follower: string
				followee: string
			}>,
		) {
			followRelationRepository.setExistingFollowRelations(existingFollowRelations)
		},
		whenUser(user: string) {
			return {
				async follows(followee: string) {
					const command: FollowUserCommand = { follower: user, followee }
					try {
						await followUserUseCase.handle(command)
					} catch (_error) {
						error = _error
					}
				},
				async unfollows(followee: string) {
					const command: UnfollowUserCommand = { follower: user, followee }
					try {
						await unfollowUserUseCase.handle(command)
					} catch (_error) {
						error = _error
					}
				},
			}
		},
		thenErrorShouldBe(errorInstance: new () => Error) {
			expect(error).toBeInstanceOf(errorInstance)
		},
		thenUser(user: string) {
			return {
				async shouldFollowUsers(expectedFollowees: string[]) {
					expect(await followRelationRepository.getFolloweesOf(user)).toStrictEqual(expectedFollowees)
				},
			}
		},
		followRelationRepository,
	}
}

export type FollowingFixture = ReturnType<typeof createFollowingFixture>
