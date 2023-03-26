import type { TimelinePresenter } from "@application/presenters/timeline.presenter"
import type { DateProvider } from "@application/providers/date.provider"
import type { Timeline } from "@domain/timeline"

const MS_IN_A_MINUTE = 1000 * 60

export class DefaultTimelinePresenter implements TimelinePresenter {
	constructor(private readonly dateProvider: DateProvider) {}

	public show(timeline: Timeline) {
		return timeline.properties.map((message) => ({
			author: message.author,
			message: message.message,
			publicationLabel: this.computeRelativePublishedAtLabel(message.publishedAt),
		}))
	}

	private computeRelativePublishedAtLabel(publishedAt: Date): string {
		const timeSincePublicationInMs = this.dateProvider.now().getTime() - publishedAt.getTime()
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
