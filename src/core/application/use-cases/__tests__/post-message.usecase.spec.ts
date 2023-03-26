import type { MessageRepository } from "@application/repositories/message.repository"
import { messageBuilder } from "@domain/__tests__/message.builder"
import { userBuilder } from "@domain/__tests__/user.builder"
// import { messageBuilder } from "@domain/__tests__/message.builder"
// import { EmptyMessageError, MessageTooLongError } from "@domain/message"
import { StubDateProvider } from "@infra/providers/__tests__/date.stub"

import type { PostMessageCommand } from "../post-message.usecase"
import { PostMessageUseCase, UnauthorizedActionError } from "../post-message.usecase"
import type { UserRepository } from "./../../repositories/user.repository"
import type { MessagingFixture } from "./messaging.fixture"
import { createMessagingFixture } from "./messaging.fixture"
import type { RegisteringFixture } from "./registering.fixture"
import { createRegisteringFixture } from "./registering.fixture"

describe("Feature: post a message", () => {
	let messagingFixture: MessagingFixture
	let registeringFixture: RegisteringFixture
	beforeEach(() => {
		registeringFixture = createRegisteringFixture()
		messagingFixture = createMessagingFixture()
	})
	let _fixture: ReturnType<typeof createFixture>

	beforeEach(() => {
		_fixture = createFixture(messagingFixture.messageRepository, registeringFixture.userRepository)
	})

	describe("Rule: a message can't be longer than 280 characters", () => {
		test("Bob posts a message on his timeline", async () => {
			messagingFixture.givenNoExistingMessage()
			_fixture.givenNowIs(new Date("2022-01-15T00:00:00.000Z"))
			registeringFixture.givenExistingUsers([
				userBuilder().withUsername("bob").withPassword("bobpassword").build(),
			])

			await _fixture.whenPostingMessage({
				id: "message_1",
				username: "bob",
				password: "bobpassword",
				message: "First message from Bob :)",
			})

			messagingFixture.thenMessagesShouldBe([
				messageBuilder()
					.withId("message_1")
					.authoredBy("bob")
					.withMessage("First message from Bob :)")
					.publishedAt(new Date("2022-01-15T00:00:00.000Z"))
					.build(),
			])
		})

		// 	test("Alice posts her second message to her timeline", async () => {
		// 		messagingFixture.givenExistingMessages([
		// 			messageBuilder()
		// 				.withId("message_1")
		// 				.authoredBy("Alice")
		// 				.withMessage("First message from Alice :)")
		// 				.publishedAt(new Date("2022-01-14T00:00:00.000Z"))
		// 				.build(),
		// 		])
		// 		messagingFixture.givenNowIs(new Date("2022-01-15T00:00:00.000Z"))

		// 		await messagingFixture.whenPostingMessage({
		// 			id: "message_2",
		// 			username: "Alice",
		// 			message: "Second message from Alice :D",
		// 		})

		// 		messagingFixture.thenMessagesShouldBe([
		// 			messageBuilder()
		// 				.withId("message_1")
		// 				.authoredBy("Alice")
		// 				.withMessage("First message from Alice :)")
		// 				.publishedAt(new Date("2022-01-14T00:00:00.000Z"))
		// 				.build(),
		// 			messageBuilder()
		// 				.withId("message_2")
		// 				.authoredBy("Alice")
		// 				.withMessage("Second message from Alice :D")
		// 				.publishedAt(new Date("2022-01-15T00:00:00.000Z"))
		// 				.build(),
		// 		])
		// 	})

		// 	test("Bob can't post a message that is longer than 280 characters long", async () => {
		// 		const messageWith281Chars = "B".repeat(281)
		// 		messagingFixture.givenNoExistingMessage()

		// 		await messagingFixture.whenPostingMessage({
		// 			id: "message_1",
		// 			username: "Bob",
		// 			message: messageWith281Chars,
		// 		})

		// 		messagingFixture.thenErrorShouldBe(MessageTooLongError)
		// 	})
	})

	// describe("Rule: messages can't be empty", () => {
	// 	test("Bob tries to post a message that is empty", async () => {
	// 		const emptyMessage = ""
	// 		messagingFixture.givenNoExistingMessage()

	// 		await messagingFixture.whenPostingMessage({
	// 			id: "message_1",
	// 			username: "Bob",
	// 			message: emptyMessage,
	// 		})

	// 		messagingFixture.thenErrorShouldBe(EmptyMessageError)
	// 	})

	// 	test("Bob tries to post a message that only contains whitespace", async () => {
	// 		const onlyWhitespaceMessage = "\t\n "
	// 		messagingFixture.givenNoExistingMessage()

	// 		await messagingFixture.whenPostingMessage({
	// 			id: "message_1",
	// 			username: "Bob",
	// 			message: onlyWhitespaceMessage,
	// 		})

	// 		messagingFixture.thenErrorShouldBe(EmptyMessageError)
	// 	})
	// })

	describe("Rule: can only post a message when being authenticated", () => {
		let _fixture: ReturnType<typeof createFixture>

		beforeEach(() => {
			_fixture = createFixture(messagingFixture.messageRepository, registeringFixture.userRepository)
		})

		test("Bob can't post a message if he doesn't have an account", async () => {
			messagingFixture.givenNoExistingMessage()
			messagingFixture.givenNowIs(new Date("2022-01-15T00:00:00.000Z"))
			registeringFixture.givenNoExistingUsers()

			await _fixture.whenPostingMessage({
				username: "Bob",
				password: "bobpassword",
				id: "message_1",
				message: "First message from bob :)",
			})

			_fixture.thenErrorShouldBe(UnauthorizedActionError)
		})

		test("Bob can't post a message if he doesn't provide the correct password", async () => {
			registeringFixture.givenExistingUsers([
				userBuilder().withUsername("bob").withPassword("bobpassword").build(),
			])
			messagingFixture.givenNoExistingMessage()
			_fixture.givenNowIs(new Date("2022-01-15T00:00:00.000Z"))

			await _fixture.whenPostingMessage({
				username: "bob",
				password: "wrongpassword",
				id: "message_1",
				message: "First message from bob :)",
			})

			_fixture.thenErrorShouldBe(UnauthorizedActionError)
		})
	})
})

function createFixture(messageRepository: MessageRepository, userRepository: UserRepository) {
	const stubDateProvider = new StubDateProvider()

	const postMessageUseCase = new PostMessageUseCase(messageRepository, userRepository, stubDateProvider)
	let error: unknown

	return {
		givenNowIs(now: Date) {
			stubDateProvider.currentDate = now
		},
		async whenPostingMessage(command: PostMessageCommand) {
			try {
				await postMessageUseCase.handle(command)
			} catch (_error) {
				error = _error
			}
		},
		thenErrorShouldBe(errorInstance: new () => Error) {
			expect(error).toBeInstanceOf(errorInstance)
		},
	}
}
