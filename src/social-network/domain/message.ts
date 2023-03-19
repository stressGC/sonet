export class Message {
	private constructor(
		private readonly _id: string,
		private readonly _author: string,
		private _message: MessageText,
		private readonly _publishedAt: Date,
	) {}

	public static from(id: string, author: string, message: string, publishedAt: Date) {
		return new Message(id, author, MessageText.from(message), publishedAt)
	}

	public editMessage(newMessage: string) {
		this._message = MessageText.from(newMessage)
	}

	get properties() {
		return {
			id: this._id,
			author: this._author,
			message: this._message.value,
			publishedAt: this._publishedAt,
		}
	}
}

class MessageText {
	private constructor(private _value: string) {}

	public static from(value: string) {
		if (value.trim().length === 0) {
			throw new EmptyMessageError()
		}
		if (value.length > 280) {
			throw new MessageTooLongError()
		}
		return new MessageText(value)
	}

	get value() {
		return this._value
	}
}

export class MessageTooLongError extends Error {}
export class EmptyMessageError extends Error {}
export class MessageNotFoundError extends Error {}
