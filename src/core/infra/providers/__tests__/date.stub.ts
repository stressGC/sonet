import type { DateProvider } from "@application/providers/date.provider"

export class StubDateProvider implements DateProvider {
	public currentDate: Date = new Date(0)

	public now() {
		return this.currentDate
	}
}
