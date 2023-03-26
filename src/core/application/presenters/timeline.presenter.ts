import type { Timeline } from "@domain/timeline"

export type TimelinePresenter = {
	show: (timeline: Timeline) => void
}
