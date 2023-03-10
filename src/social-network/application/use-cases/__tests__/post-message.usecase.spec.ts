import { InMemoryMessageRepository } from "@infra/messageRepository.inmemory"
import {
	type PostMessageCommand,
	PostMessageUseCase,
	MessageTooLongError,
	EmptyMessageError,
} from "@application/use-cases/post-message.usecase"
import { StubDateProvider } from "@infra/__tests__/date.stub.provider"
import { messageBuilder } from "@domain/__tests__/message.builder"
import type { Message } from "@domain/message"

describe("Feature: post a message", () => {
	let sut: SUT
	beforeEach(() => {
		sut = createSut()
	})

	describe("Rule: a message can't be longer than 280 characters", () => {
		test("Bob posts a message on his timeline", async () => {
			sut.givenNoExistingMessage()
			sut.givenNowIs(new Date("15 Jan 2023"))

			await sut.whenPostingMessage({
				id: "message_1",
				author: "Bob",
				message: "First message from bob :)",
			})

			sut.thenMessagesShouldBe([
				messageBuilder()
					.withId("message_1")
					.authoredBy("Bob")
					.withMessage("First message from bob :)")
					.publishedAt(new Date("15 Jan 2023"))
					.build(),
			])
		})

		test("Alice posts her second message to her timeline", async () => {
			sut.givenExistingMessages([
				messageBuilder()
					.withId("message_1")
					.authoredBy("Alice")
					.withMessage("First message from Alice :)")
					.publishedAt(new Date("14 Jan 2023"))
					.build(),
			])
			sut.givenNowIs(new Date("15 Jan 2023"))

			await sut.whenPostingMessage({
				id: "message_2",
				author: "Alice",
				message: "Second message from Alice :D",
			})

			sut.thenMessagesShouldBe([
				messageBuilder()
					.withId("message_1")
					.authoredBy("Alice")
					.withMessage("First message from Alice :)")
					.publishedAt(new Date("14 Jan 2023"))
					.build(),
				messageBuilder()
					.withId("message_2")
					.authoredBy("Alice")
					.withMessage("Second message from Alice :D")
					.publishedAt(new Date("15 Jan 2023"))
					.build(),
			])
		})

		test("Bob can't post a message that is longer than 280 characters long", async () => {
			const messageWith281Chars = "B".repeat(281)
			sut.givenNoExistingMessage()

			await sut.whenPostingMessage({
				id: "message_1",
				author: "Bob",
				message: messageWith281Chars,
			})

			sut.thenRequestShouldBeDeniedWithError(new MessageTooLongError())
		})
	})

	describe("Rule: messages can't be empty", () => {
		test("Bob tries to post a message that is empty", async () => {
			const emptyMessage = ""
			sut.givenNoExistingMessage()

			await sut.whenPostingMessage({
				id: "message_1",
				author: "Bob",
				message: emptyMessage,
			})

			sut.thenRequestShouldBeDeniedWithError(new EmptyMessageError())
		})

		test("Bob tries to post a message that only contains whitespace", async () => {
			const onlyWhitespaceMessage = "\t\n "
			sut.givenNoExistingMessage()

			await sut.whenPostingMessage({
				id: "message_1",
				author: "Bob",
				message: onlyWhitespaceMessage,
			})

			sut.thenRequestShouldBeDeniedWithError(new EmptyMessageError())
		})
	})
})

function createSut() {
	const messageRepository = new InMemoryMessageRepository()
	const stubDateProvider = new StubDateProvider()
	const postMessageUseCase = new PostMessageUseCase(messageRepository, stubDateProvider)

	let error: unknown

	return {
		givenNowIs(now: Date) {
			stubDateProvider.currentDate = now
		},
		givenExistingMessages(messages: Array<Message>) {
			messageRepository.setExistingMessages(messages)
		},
		givenNoExistingMessage() {
			messageRepository.setExistingMessages([])
		},
		async whenPostingMessage(command: PostMessageCommand) {
			try {
				await postMessageUseCase.handle(command)
			} catch (_error) {
				error = _error
			}
		},
		thenMessagesShouldBe(messages: Array<Message>) {
			expect(messageRepository.messages).toStrictEqual(messages)
		},
		thenRequestShouldBeDeniedWithError(errorInstance: Error) {
			expect(error).toStrictEqual(errorInstance)
		},
	}
}

type SUT = ReturnType<typeof createSut>
