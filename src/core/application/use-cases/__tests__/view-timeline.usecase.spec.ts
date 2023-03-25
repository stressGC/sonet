import { messageBuilder } from "@domain/__tests__/message.builder"
import { createMessagingFixture, MessagingFixture } from "./messaging.fixture"

describe("Feature: view one's timeline", () => {
	let fixture: MessagingFixture
	beforeEach(() => {
		fixture = createMessagingFixture()
	})

	describe("Rule: Messages are shown in reverse chronological order", () => {
		test("Alice can view the 3 messages she published in her timeline", async () => {
			const aliceMessageBuilder = messageBuilder().authoredBy("Alice")
			fixture.givenExistingMessages([
				aliceMessageBuilder
					.withId("message_1")
					.withMessage("This is a cool app!")
					.publishedAt(new Date("15 Jan 2020 8:01 PM"))
					.build(),
				aliceMessageBuilder
					.withId("message_2")
					.withMessage("Hello I'm Alice!")
					.publishedAt(new Date("15 Jan 2020 8:00 PM"))
					.build(),
				aliceMessageBuilder
					.withId("message_3")
					.withMessage("Anyone from Paris?")
					.publishedAt(new Date("15 Jan 2020 8:02 PM"))
					.build(),
			])
			fixture.givenNowIs(new Date("15 Jan 2020 8:02 PM"))

			await fixture.whenUserSeesTimelineOf({ user: "Alice" })

			fixture.thenUserShouldSee([
				{ author: "Alice", publicationLabel: "less than a minute ago", message: "Anyone from Paris?" },
				{ author: "Alice", publicationLabel: "1 minute ago", message: "This is a cool app!" },
				{ author: "Alice", publicationLabel: "2 minutes ago", message: "Hello I'm Alice!" },
			])
		})
	})

	describe("Rule: only messages of the specified user are shown", () => {
		test("Alice doesn't see Bob's message in her timeline", async () => {
			const aliceMessageBuilder = messageBuilder().authoredBy("Alice")
			fixture.givenExistingMessages([
				aliceMessageBuilder
					.withId("message_1")
					.withMessage("This is a cool app!")
					.publishedAt(new Date("15 Jan 2020 8:01 PM"))
					.build(),
				aliceMessageBuilder
					.withId("message_2")
					.withMessage("Hello I'm Alice!")
					.publishedAt(new Date("15 Jan 2020 8:00 PM"))
					.build(),
				messageBuilder()
					.authoredBy("Bob")
					.withId("message_3")
					.withMessage("Let's go Biarritz!!")
					.publishedAt(new Date("15 Jan 2020 8:02 PM"))
					.build(),
			])
			fixture.givenNowIs(new Date("15 Jan 2020 8:02 PM"))

			await fixture.whenUserSeesTimelineOf({ user: "Alice" })

			fixture.thenUserShouldSee([
				{ author: "Alice", publicationLabel: "1 minute ago", message: "This is a cool app!" },
				{ author: "Alice", publicationLabel: "2 minutes ago", message: "Hello I'm Alice!" },
			])
		})
	})
})
