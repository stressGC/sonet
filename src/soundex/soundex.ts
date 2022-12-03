/**
 * Soundex algorithm
 * @link https://wikipedia.org/wiki/Soundex
 *
 * The Soundex code for a name consists of a letter followed by three numerical digits:
 * the letter is the first letter of the name, and the digits encode the remaining consonants.
 * Consonants at a similar place of articulation share the same digit so, for example, the
 * labial consonants B, F, P, and V are each encoded as the number 1.
 * 1. Retain the first letter of the name and drop all other occurrences of a, e, i, o, u, y, h, w.
 * 2. Replace consonants with digits as follows (after the first letter):
 * - b, f, p, v → 1
 * - c, g, j, k, q, s, x, z → 2
 * - d, t → 3
 * - l → 4
 * - m, n → 5
 * - r → 6
 * 3. If two or more letters with the same number are adjacent in the original name (before step 1),
 * only retain the first letter; also two letters with the same number separated by 'h', 'w' or 'y'
 * are coded as a single number, whereas such letters separated by a vowel are coded twice. This rule
 * also applies to the first letter.
 * 4. If there are too few letters in the word to assign three numbers, append zeros until there are
 * three numbers. If there are four or more numbers, retain only the first three.
 */

export function encode(word: string) {
	const uppercasedWord = word.toUpperCase()
	return zeroPad(encodeHead(uppercasedWord) + encodeTail(uppercasedWord))
}

function encodeHead(word: string) {
	return word.charAt(0)
}

function encodeTail(word: string) {
	const [, ...tailChars] = word

	return tailChars.map(replaceConsonantByDigit).join("")
}

function zeroPad(encodedWord: string) {
	return encodedWord.padEnd(4, "0")
}

function replaceConsonantByDigit(consonant: string) {
	const consonantDigitEncodingMap: Record<string, string[]> = {
		"1": ["B", "F", "P", "V"],
		"2": ["C", "G", "J", "K", "Q", "S", "X", "Z"],
		"3": ["D", "T"],
		"4": ["L"],
		"5": ["M", "N"],
		"6": ["R"],
	}
	return Object.keys(consonantDigitEncodingMap).find((digit) => {
		return consonantDigitEncodingMap[digit]?.includes(consonant)
	})
}
