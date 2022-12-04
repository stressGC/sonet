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
		expect(soundex.encode("Gbcd")).toBe(soundex.encode("GBCD"))
	})

	it("ignores vowel-like letters", () => {
		expect(soundex.encode("GaAeEiIoOuUhHyYcdl")).toBe("G234")
	})

	it("ignores non-alphanumerical characters", () => {
		expect(soundex.encode("G#")).toBe("G000")
	})

	it("replaces multiple consonants with digits", () => {
		expect(soundex.encode("Gbcd")).toBe("G123")
	})

	it("limits length to 4 characters", () => {
		expect(soundex.encode("Gbcdl")).toBe("G123")
	})

	it("combines duplicate encodings", () => {
		expect(soundex.encode("Gbfpv")).toBe("G100")
	})

	it.skip("combines codes when 2nd letter duplicates 1st", () => {
		expect(soundex.encode("Bbcd")).toBe("B230")
	})
})
