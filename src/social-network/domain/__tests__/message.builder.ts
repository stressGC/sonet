import type { Message } from "@domain/message"

export function messageBuilder({
	id = "message_id",
	author = "Author",
	message = "some message",
	publishedAt = new Date(0),
}: Partial<Message> = {}) {
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
			return {
				id: props.id,
				author: props.author,
				message: props.message,
				publishedAt: props.publishedAt,
			}
		},
	}
}
