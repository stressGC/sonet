export type PostMessageCommand = { user: string; message: string }

type Message = { user: string; message: string }

export class InMemoryMessageRepository implements MessageRepository {
	private _messages: Message[] = []

	public async save(message: Message) {
		this._messages = [...this._messages, message]
	}

	public setExistingMessages(existingMessages: Message[]) {
		this._messages = existingMessages
	}

	get messages() {
		return this._messages
	}
}

export class PostMessageUseCase {
	constructor(private readonly messageRepository: MessageRepository) {}

	async handle(command: PostMessageCommand) {
		await this.messageRepository.save({ user: command.user, message: command.message })
	}
}

export type MessageRepository = {
	save: (message: Message) => Promise<void>
}

describe("Feature: post a message", () => {
	let sut: SUT
	beforeEach(() => {
		sut = createSut()
	})

	test("Bob posts the first message of the app", async () => {
		sut.givenNoExistingMessages()

		await sut.whenPostingMessage({
			user: "Bob",
			message: "First message :)",
		})

		sut.thenMessagesShouldBe([
			{
				user: "Bob",
				message: "First message :)",
			},
		])
	})

	test("Alice posts her second message", async () => {
		sut.givenExistingMessages([
			{
				user: "Alice",
				message: "First message :)",
			},
		])

		await sut.whenPostingMessage({
			user: "Alice",
			message: "Second message :D",
		})

		sut.thenMessagesShouldBe([
			{
				user: "Alice",
				message: "First message :)",
			},
			{
				user: "Alice",
				message: "Second message :D",
			},
		])
	})
})

function createSut() {
	const messageRepository = new InMemoryMessageRepository()
	const postMessageUseCase = new PostMessageUseCase(messageRepository)
	return {
		givenExistingMessages(messages: Array<{ user: string; message: string }>) {
			messageRepository.setExistingMessages(messages)
		},
		givenNoExistingMessages() {
			messageRepository.setExistingMessages([])
		},
		async whenPostingMessage(command: PostMessageCommand) {
			await postMessageUseCase.handle(command)
		},
		thenMessagesShouldBe(messages: Array<{ user: string; message: string }>) {
			expect(messageRepository.messages).toStrictEqual(messages)
		},
	}
}

type SUT = ReturnType<typeof createSut>
