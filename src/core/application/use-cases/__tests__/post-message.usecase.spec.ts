import { messageBuilder } from "@domain/__tests__/message.builder"
import { EmptyMessageError, MessageTooLongError } from "@domain/message"
import type { MessagingFixture } from "./messaging.fixture"
import { createMessagingFixture } from "./messaging.fixture"

describe("Feature: post a message", () => {
	let fixture: MessagingFixture
	beforeEach(() => {
		fixture = createMessagingFixture()
	})

	describe("Rule: a message can't be longer than 280 characters", () => {
		test("Bob posts a message on his timeline", async () => {
			fixture.givenNoExistingMessage()
			fixture.givenNowIs(new Date("2022-01-15T00:00:00.000Z"))

			await fixture.whenPostingMessage({
				id: "message_1",
				author: "Bob",
				message: "First message from bob :)",
			})

			fixture.thenMessagesShouldBe([
				messageBuilder()
					.withId("message_1")
					.authoredBy("Bob")
					.withMessage("First message from bob :)")
					.publishedAt(new Date("2022-01-15T00:00:00.000Z"))
					.build(),
			])
		})

		test("Alice posts her second message to her timeline", async () => {
			fixture.givenExistingMessages([
				messageBuilder()
					.withId("message_1")
					.authoredBy("Alice")
					.withMessage("First message from Alice :)")
					.publishedAt(new Date("2022-01-14T00:00:00.000Z"))
					.build(),
			])
			fixture.givenNowIs(new Date("2022-01-15T00:00:00.000Z"))

			await fixture.whenPostingMessage({
				id: "message_2",
				author: "Alice",
				message: "Second message from Alice :D",
			})

			fixture.thenMessagesShouldBe([
				messageBuilder()
					.withId("message_1")
					.authoredBy("Alice")
					.withMessage("First message from Alice :)")
					.publishedAt(new Date("2022-01-14T00:00:00.000Z"))
					.build(),
				messageBuilder()
					.withId("message_2")
					.authoredBy("Alice")
					.withMessage("Second message from Alice :D")
					.publishedAt(new Date("2022-01-15T00:00:00.000Z"))
					.build(),
			])
		})

		test("Bob can't post a message that is longer than 280 characters long", async () => {
			const messageWith281Chars = "B".repeat(281)
			fixture.givenNoExistingMessage()

			await fixture.whenPostingMessage({
				id: "message_1",
				author: "Bob",
				message: messageWith281Chars,
			})

			fixture.thenErrorShouldBe(MessageTooLongError)
		})
	})

	describe("Rule: messages can't be empty", () => {
		test("Bob tries to post a message that is empty", async () => {
			const emptyMessage = ""
			fixture.givenNoExistingMessage()

			await fixture.whenPostingMessage({
				id: "message_1",
				author: "Bob",
				message: emptyMessage,
			})

			fixture.thenErrorShouldBe(EmptyMessageError)
		})

		test("Bob tries to post a message that only contains whitespace", async () => {
			const onlyWhitespaceMessage = "\t\n "
			fixture.givenNoExistingMessage()

			await fixture.whenPostingMessage({
				id: "message_1",
				author: "Bob",
				message: onlyWhitespaceMessage,
			})

			fixture.thenErrorShouldBe(EmptyMessageError)
		})
	})
})
