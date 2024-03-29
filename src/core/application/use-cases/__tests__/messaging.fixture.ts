import { DefaultTimelinePresenter } from "@application/presenters/timeline.default.presenter"
import type { TimelinePresenter } from "@application/presenters/timeline.presenter"
import type { Message } from "@domain/message"
import { StubDateProvider } from "@infra/providers/__tests__/date.stub"
import { InMemoryMessageRepository } from "@infra/repositories/message.inmemory.repository"

import type { EditMessageCommand } from "../edit-message.usecase"
import { EditMessageUseCase } from "../edit-message.usecase"
import type { ViewTimelineCommand } from "../view-timeline.usecase"
import { ViewTimelineUseCase } from "../view-timeline.usecase"

export function createMessagingFixture() {
	const messageRepository = new InMemoryMessageRepository()
	const stubDateProvider = new StubDateProvider()

	const editMessageUseCase = new EditMessageUseCase(messageRepository)
	const viewTimelineUseCase = new ViewTimelineUseCase(messageRepository)

	const defaultTimelinePresenter = new DefaultTimelinePresenter(stubDateProvider)

	const timelinePresenter: TimelinePresenter = {
		show(_timeline) {
			timeline = defaultTimelinePresenter.show(_timeline)
		},
	}

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
		async whenEditingMessage(command: EditMessageCommand) {
			try {
				await editMessageUseCase.handle(command)
			} catch (_error) {
				error = _error
			}
		},
		async whenUserSeesTimelineOf(command: ViewTimelineCommand) {
			try {
				await viewTimelineUseCase.handle(command, timelinePresenter)
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
		messageRepository,
	}
}

export type MessagingFixture = ReturnType<typeof createMessagingFixture>
