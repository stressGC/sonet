import * as soundex from "./soundex"

describe("Soundex", () => {
	it("retains the first letter of a one-letter word", () => {
		expect(soundex.encode("G")).toBe("G000")
	})

	it("pads with zeros to always ensure 3 digits", () => {
		expect(soundex.encode("G")).toBe("G000")
	})

	it("replaces consonant with digits", () => {
		expect(soundex.encode("Gb")).toBe("G100")
		expect(soundex.encode("Gc")).toBe("G200")
	})

	it("is case insensitive", () => {
		expect(soundex.encode("Gb")).toBe(soundex.encode("GB"))
	})

	it("ignores non-alphanumerical characters", () => {
		expect(soundex.encode("G#")).toBe("G000")
	})
})
