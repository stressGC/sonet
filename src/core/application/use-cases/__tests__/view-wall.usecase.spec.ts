import { DefaultTimelinePresenter } from "@application/presenters/timeline.default.presenter"
import type { TimelinePresenter } from "@application/presenters/timeline.presenter"
import type { FollowRelationRepository } from "@application/repositories/follow-relations.repository"
import type { MessageRepository } from "@application/repositories/message.repository"
import { followRelationBuilder } from "@domain/__tests__/follow-relation.builder"
import { messageBuilder } from "@domain/__tests__/message.builder"
import { StubDateProvider } from "@infra/providers/__tests__/date.stub"

import { ViewWallUseCase } from "../view-wall.usecase"
import type { FollowingFixture } from "./following.fixture"
import { createFollowingFixture } from "./following.fixture"
import type { MessagingFixture } from "./messaging.fixture"
import { createMessagingFixture } from "./messaging.fixture"

describe("Feature: view a user's wall", () => {
	let messagingFixture: MessagingFixture
	let followingFixture: FollowingFixture
	let fixture: ReturnType<typeof createFixture>

	beforeEach(() => {
		messagingFixture = createMessagingFixture()
		followingFixture = createFollowingFixture()
		fixture = createFixture({
			messageRepository: messagingFixture.messageRepository,
			followRelationRepository: followingFixture.followRelationRepository,
		})
	})

	describe("Rule: All the messages from the user and its followees should appear in reverse chronological order", () => {
		test("Charlie has subscribed to Alice's timeline, and thus can view an aggregated list of all subscriptions", async () => {
			messagingFixture.givenExistingMessages([
				messageBuilder()
					.withId("message_1")
					.authoredBy("Alice")
					.withMessage("Anyone from Paris?")
					.publishedAt(new Date("2022-01-15T08:00:00.000Z"))
					.build(),
				messageBuilder()
					.withId("message_2")
					.authoredBy("Charlie")
					.withMessage("@Alice yes it's nice")
					.publishedAt(new Date("2022-01-15T07:59:00.000Z"))
					.build(),
				messageBuilder()
					.withId("message_3")
					.authoredBy("Alice")
					.withMessage("This is a cool app!")
					.publishedAt(new Date("2022-01-15T07:58:00.000Z"))
					.build(),
				messageBuilder()
					.withId("message_4")
					.authoredBy("Bob")
					.withMessage("Gardening today")
					.publishedAt(new Date("2022-01-15T07:55:00.000Z"))
					.build(),
			])
			followingFixture.givenExistingFollowRelations([
				followRelationBuilder().whereUser("Charlie").follows("Alice").build(),
			])
			fixture.givenNowIs(new Date("2022-01-15T08:00:00.000Z"))

			await fixture.whenUserSeesTheWallOf("Charlie")

			fixture.thenUserShouldSee([
				{ author: "Alice", publicationLabel: "less than a minute ago", message: "Anyone from Paris?" },
				{ author: "Charlie", publicationLabel: "1 minute ago", message: "@Alice yes it's nice" },
				{ author: "Alice", publicationLabel: "2 minutes ago", message: "This is a cool app!" },
			])
		})
	})
})

const createFixture = ({
	messageRepository,
	followRelationRepository,
}: {
	messageRepository: MessageRepository
	followRelationRepository: FollowRelationRepository
}) => {
	let wall: { author: string; message: string; publicationLabel: string }[]
	const dateProvider = new StubDateProvider()
	const viewWallUseCase = new ViewWallUseCase(messageRepository, followRelationRepository)
	const defaultWallPresenter = new DefaultTimelinePresenter(dateProvider)
	const wallPresenter: TimelinePresenter = {
		show(_wall) {
			wall = defaultWallPresenter.show(_wall)
		},
	}
	return {
		givenNowIs(now: Date) {
			dateProvider.currentDate = now
		},
		async whenUserSeesTheWallOf(user: string) {
			await viewWallUseCase.handle({ user }, wallPresenter)
		},
		thenUserShouldSee(expectedWall: { author: string; message: string; publicationLabel: string }[]) {
			expect(wall).toEqual(expectedWall)
		},
	}
}
