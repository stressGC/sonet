import { messageBuilder } from "@domain/__tests__/message.builder"
import { EmptyMessageError, MessageNotFoundError, MessageTooLongError } from "@domain/message"
import { createMessagingFixture, MessagingFixture } from "./messaging.fixture"

describe("Feature: edit a message", () => {
	let fixture: MessagingFixture
	beforeEach(() => {
		fixture = createMessagingFixture()
	})

	describe("Rule: only existing messages can be edited", () => {
		test("Bob edits a message of his timeline", async () => {
			const bobMessageBuilder = messageBuilder()
				.authoredBy("Bob")
				.publishedAt(new Date("2022-01-15T00:00:00.000Z"))
				.withId("message_1")
			fixture.givenExistingMessages([bobMessageBuilder.withMessage("initial message").build()])

			await fixture.whenEditingMessage({
				id: "message_1",
				message: "edited message",
			})

			fixture.thenMessagesShouldBe([bobMessageBuilder.withMessage("edited message").build()])
		})

		test("Bob can't edit a message that doesn't exist", async () => {
			fixture.givenExistingMessages([
				messageBuilder()
					.authoredBy("Alice")
					.publishedAt(new Date("2022-01-15T00:00:00.000Z"))
					.withId("message_1")
					.withMessage("Alice message!!")
					.build(),
				messageBuilder()
					.authoredBy("Bob")
					.publishedAt(new Date("2022-02-15T00:00:00.000Z"))
					.withId("message_2")
					.withMessage("Hey I'm Bob!!")
					.build(),
			])

			await fixture.whenEditingMessage({
				id: "message_3",
				message: "edited message",
			})

			fixture.thenErrorShouldBe(MessageNotFoundError)
		})
	})

	describe("Rule: edited messages can't be empty", () => {
		test("Bob tries to edit a message to an empty one", async () => {
			const emptyMessage = ""
			fixture.givenExistingMessages([
				messageBuilder()
					.authoredBy("Bob")
					.publishedAt(new Date("2022-01-15T00:00:00.000Z"))
					.withId("message_1")
					.withMessage("Hey I'm Bob!")
					.build(),
			])

			await fixture.whenEditingMessage({
				id: "message_1",
				message: emptyMessage,
			})

			fixture.thenErrorShouldBe(EmptyMessageError)
		})

		test("Bob tries to edit a message to one that only contains whitespace", async () => {
			const onlyWhitespaceMessage = "\t\n "
			fixture.givenExistingMessages([
				messageBuilder()
					.authoredBy("Bob")
					.publishedAt(new Date("2022-01-15T00:00:00.000Z"))
					.withId("message_1")
					.withMessage("Hey I'm Bob!")
					.build(),
			])

			await fixture.whenEditingMessage({
				id: "message_1",
				message: onlyWhitespaceMessage,
			})

			fixture.thenErrorShouldBe(EmptyMessageError)
		})
	})

	describe("Rule: edited messages can't be longer than 280 characters", () => {
		test("Bob can't post a message that is longer than 280 characters long", async () => {
			const messageWith281Chars = "B".repeat(281)
			fixture.givenExistingMessages([
				messageBuilder()
					.authoredBy("Bob")
					.publishedAt(new Date("2022-01-15T00:00:00.000Z"))
					.withId("message_1")
					.withMessage("Hey I'm Bob!")
					.build(),
			])

			await fixture.whenEditingMessage({
				id: "message_1",
				message: messageWith281Chars,
			})

			fixture.thenErrorShouldBe(MessageTooLongError)
		})
	})
})
