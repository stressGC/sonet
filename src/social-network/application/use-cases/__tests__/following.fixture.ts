import { InMemoryFollowRelationsRepository } from "@infra/repositories/follow-relations.inmemory.repository"
import { FollowUserUseCase, type FollowUserCommand } from "../follow-user.usecase"

export function createFollowingFixture() {
	const followRelationsRepository = new InMemoryFollowRelationsRepository()
	const followUserUseCase = new FollowUserUseCase(followRelationsRepository)
	let error: unknown

	return {
		givenNoExistingFollowRelations() {
			followRelationsRepository.setExistingFollowRelations([])
		},
		givenExistingFollowRelations(
			existingFollowRelations: Array<{
				follower: string
				followee: string
			}>,
		) {
			followRelationsRepository.setExistingFollowRelations(existingFollowRelations)
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
			}
		},
		thenErrorShouldBe(errorInstance: new () => Error) {
			expect(error).toBeInstanceOf(errorInstance)
		},
		thenUser(user: string) {
			return {
				async shouldFollowUsers(expectedFollowees: string[]) {
					expect(await followRelationsRepository.getFolloweesOf(user)).toStrictEqual(expectedFollowees)
				},
			}
		},
	}
}

export type FollowingFixture = ReturnType<typeof createFollowingFixture>
