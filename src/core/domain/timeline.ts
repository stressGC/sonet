import type { DateProvider } from "@application/providers/date.provider"
import type { Message } from "./message"

const MS_IN_A_MINUTE = 1000 * 60

export class Timeline {
	constructor(private readonly dateProvider: DateProvider, private readonly messages: Message[]) {}

	public format() {
		return this._format(this.sortMessages(this.messages))
	}

	private sortMessages(messages: Message[]) {
		return [...messages].sort(
			(messageA, messageB) =>
				messageB.properties.publishedAt.getTime() - messageA.properties.publishedAt.getTime(),
		)
	}

	private _format(messages: Message[]) {
		return messages.map((message) => ({
			author: message.properties.author,
			message: message.properties.message,
			publicationLabel: this.computePublicationLabelOf(message),
		}))
	}

	private computePublicationLabelOf(message: Message): string {
		const timeSincePublicationInMs = this.dateProvider.now().getTime() - message.properties.publishedAt.getTime()
		const timeSincePublicationInMins = Math.floor(timeSincePublicationInMs / MS_IN_A_MINUTE)

		if (timeSincePublicationInMins === 0) {
			return "less than a minute ago"
		}
		if (timeSincePublicationInMins === 1) {
			return "1 minute ago"
		}
		return `${timeSincePublicationInMins} minutes ago`
	}
}
