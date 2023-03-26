import type { Timeline } from "@domain/timeline"
import type { DefaultTimelinePresenter } from "./timeline.default.presenter"
import type { TimelinePresenter } from "./timeline.presenter"

export class ConsoleTimelinePresenter implements TimelinePresenter {
	constructor(private readonly defaultTimelinePresenter: DefaultTimelinePresenter) {}

	show(timeline: Timeline): void {
		console.table(this.defaultTimelinePresenter.show(timeline))
	}
}
