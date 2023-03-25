import { followRelationBuilder } from "@domain/__tests__/follow-relation.builder"
import { FollowRelationNotFoundError } from "../unfollow-user.usecase"
import { createFollowingFixture } from "./following.fixture"
import type { FollowingFixture } from "./following.fixture"

describe("Feature: unfollow a user", () => {
	let fixture: FollowingFixture
	beforeEach(() => {
		fixture = createFollowingFixture()
	})

	describe("Rule: only users being followed can be unfollowed", () => {
		test("Alice unfollows Bob", async () => {
			fixture.givenExistingFollowRelations([followRelationBuilder().whereUser("Alice").follows("Bob").build()])

			await fixture.whenUser("Alice").unfollows("Bob")

			await fixture.thenUser("Alice").shouldFollowUsers([])
		})

		test("Alice can't unfollow Bob that she isn't currently following", async () => {
			fixture.givenExistingFollowRelations([])

			await fixture.whenUser("Alice").unfollows("Bob")

			fixture.thenErrorShouldBe(FollowRelationNotFoundError)
		})
	})
})
