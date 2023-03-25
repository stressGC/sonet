import { followRelationBuilder } from "@domain/__tests__/follow-relation.builder"
import { FollowRelationExistsError } from "../follow-user.usecase"
import { createFollowingFixture, FollowingFixture } from "./following.fixture"

describe("Feature: follow a user", () => {
	let fixture: FollowingFixture
	beforeEach(() => {
		fixture = createFollowingFixture()
	})

	describe("Rule: cannot follow the same user again", () => {
		test("Alice can follow Bob", async () => {
			fixture.givenNoExistingFollowRelations()

			await fixture.whenUser("Alice").follows("Bob")

			await fixture.thenUser("Alice").shouldFollowUsers(["Bob"])
		})

		test("Alice can't follow Bob a second time", async () => {
			fixture.givenExistingFollowRelations([followRelationBuilder().whereUser("Alice").follows("Bob").build()])

			await fixture.whenUser("Alice").follows("Bob")

			fixture.thenErrorShouldBe(FollowRelationExistsError)
		})
	})
})
