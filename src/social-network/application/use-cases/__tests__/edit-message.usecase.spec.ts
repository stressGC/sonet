import { InMemoryMessageRepository } from "@infra/repositories/message.inmemory.repository"
import { StubDateProvider } from "@infra/providers/__tests__/date.stub"
import { messageBuilder } from "@domain/__tests__/message.builder"
import { EmptyMessageError, Message, MessageNotFoundError, MessageTooLongError } from "@domain/message"
import { EditMessageCommand, EditMessageUseCase } from "../edit-message.usecase"

describe("Feature: edit a message", () => {
	let sut: SUT
	beforeEach(() => {
		sut = createSut()
	})

	describe("Rule: only existing messages can be edited", () => {
		test("Bob edits a message of his timeline", async () => {
			const bobMessageBuilder = messageBuilder()
				.authoredBy("Bob")
				.publishedAt(new Date("15 Jan 2020"))
				.withId("message_1")
			sut.givenExistingMessages([bobMessageBuilder.withMessage("initial message").build()])

			await sut.whenEditingMessage({
				id: "message_1",
				message: "edited message",
			})

			sut.thenMessagesShouldBe([bobMessageBuilder.withMessage("edited message").build()])
		})

		test("Bob can't edit a message that doesn't exist", async () => {
			sut.givenExistingMessages([
				messageBuilder()
					.authoredBy("Alice")
					.publishedAt(new Date("15 Jan 2020"))
					.withId("message_1")
					.withMessage("Alice message!!")
					.build(),
				messageBuilder()
					.authoredBy("Bob")
					.publishedAt(new Date("15 Feb 2020"))
					.withId("message_2")
					.withMessage("Hey I'm Bob!!")
					.build(),
			])

			await sut.whenEditingMessage({
				id: "message_3",
				message: "edited message",
			})

			sut.thenErrorShouldBe(MessageNotFoundError)
		})
	})

	describe("Rule: edited messages can't be empty", () => {
		test("Bob tries to edit a message to an empty one", async () => {
			const emptyMessage = ""
			sut.givenExistingMessages([
				messageBuilder()
					.authoredBy("Bob")
					.publishedAt(new Date("15 Jan 2020"))
					.withId("message_1")
					.withMessage("Hey I'm Bob!")
					.build(),
			])

			await sut.whenEditingMessage({
				id: "message_1",
				message: emptyMessage,
			})

			sut.thenErrorShouldBe(EmptyMessageError)
		})

		test("Bob tries to edit a message to one that only contains whitespace", async () => {
			const onlyWhitespaceMessage = "\t\n "
			sut.givenExistingMessages([
				messageBuilder()
					.authoredBy("Bob")
					.publishedAt(new Date("15 Jan 2020"))
					.withId("message_1")
					.withMessage("Hey I'm Bob!")
					.build(),
			])

			await sut.whenEditingMessage({
				id: "message_1",
				message: onlyWhitespaceMessage,
			})

			sut.thenErrorShouldBe(EmptyMessageError)
		})
	})

	describe("Rule: edited messages can't be longer than 280 characters", () => {
		test("Bob can't post a message that is longer than 280 characters long", async () => {
			const messageWith281Chars = "B".repeat(281)
			sut.givenExistingMessages([
				messageBuilder()
					.authoredBy("Bob")
					.publishedAt(new Date("15 Jan 2020"))
					.withId("message_1")
					.withMessage("Hey I'm Bob!")
					.build(),
			])

			await sut.whenEditingMessage({
				id: "message_1",
				message: messageWith281Chars,
			})

			sut.thenErrorShouldBe(MessageTooLongError)
		})
	})
})

function createSut() {
	const messageRepository = new InMemoryMessageRepository()
	const stubDateProvider = new StubDateProvider()
	const editMessageUseCase = new EditMessageUseCase(messageRepository)

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
		async whenEditingMessage(command: EditMessageCommand) {
			try {
				await editMessageUseCase.handle(command)
			} catch (_error) {
				error = _error
			}
		},
		thenMessagesShouldBe(messages: Array<Message>) {
			expect(messageRepository.messages).toStrictEqual(messages)
		},
		thenErrorShouldBe(errorInstance: new () => Error) {
			expect(error).toBeInstanceOf(errorInstance)
		},
	}
}

type SUT = ReturnType<typeof createSut>
