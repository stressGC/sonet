import type { DateProvider } from "@application/providers/date.provider"

export class RealDateProvider implements DateProvider {
	now(): Date {
		return new Date()
	}
}
