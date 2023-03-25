import { StubDateProvider } from "@infra/providers/__tests__/date.stub"
import { InMemoryMessageRepository } from "@infra/repositories/message.inmemory.repository"
import { EditMessageUseCase, type EditMessageCommand } from "../edit-message.usecase"
import { PostMessageCommand, PostMessageUseCase } from "../post-message.usecase"
import { ViewTimelineCommand, ViewTimelineUseCase } from "../view-timeline.usecase"
import type { Message } from "@domain/message"

export function createMessagingFixture() {
	const messageRepository = new InMemoryMessageRepository()
	const stubDateProvider = new StubDateProvider()

	const editMessageUseCase = new EditMessageUseCase(messageRepository)
	const postMessageUseCase = new PostMessageUseCase(messageRepository, stubDateProvider)
	const viewTimelineUseCase = new ViewTimelineUseCase(messageRepository, stubDateProvider)

	let error: unknown
	let timeline: Array<{ author: string; message: string; publicationLabel: string }>

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
		async whenEditingMessage(command: EditMessageCommand) {
			try {
				await editMessageUseCase.handle(command)
			} catch (_error) {
				error = _error
			}
		},

		async whenUserSeesTimelineOf(command: ViewTimelineCommand) {
			try {
				timeline = await viewTimelineUseCase.handle(command)
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
		thenUserShouldSee(expectedTimeline: Array<{ author: string; message: string; publicationLabel: string }>) {
			expect(timeline).toEqual(expectedTimeline)
		},
	}
}

export type MessagingFixture = ReturnType<typeof createMessagingFixture>