import type { Message } from "./message"

export class Timeline {
	constructor(private readonly messages: Message[]) {}

	get properties() {
		return this.sortMessages(this.messages).map((message) => message.properties)
	}

	private sortMessages(messages: Message[]) {
		return [...messages].sort(
			(messageA, messageB) =>
				messageB.properties.publishedAt.getTime() - messageA.properties.publishedAt.getTime(),
		)
	}
}
