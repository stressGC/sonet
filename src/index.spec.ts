import { hello } from "./index"

describe("hello", () => {
	it("should say hello", () => {
		expect(hello("Georges")).toBe("Hello Georges")
	})
})
