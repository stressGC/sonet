import { Message } from "@domain/message"

export function messageBuilder({
	id = "message_id",
	author = "Author",
	message = "some message",
	publishedAt = new Date(0),
}: Partial<{
	id: string
	author: string
	message: string
	publishedAt: Date
}> = {}) {
	const props = { id, author, message, publishedAt }
	return {
		withId(_id: string) {
			return messageBuilder({
				...props,
				id: _id,
			})
		},
		authoredBy(_author: string) {
			return messageBuilder({
				...props,
				author: _author,
			})
		},
		withMessage(_message: string) {
			return messageBuilder({
				...props,
				message: _message,
			})
		},
		publishedAt(_publishedAt: Date) {
			return messageBuilder({
				...props,
				publishedAt: _publishedAt,
			})
		},
		build(): Message {
			return Message.from(props.id, props.author, props.message, props.publishedAt)
		},
	}
}
