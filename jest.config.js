/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
	// Indicates whether the coverage information should be collected while executing the test
	collectCoverage: false,

	// An array of file extensions your modules use
	moduleFileExtensions: ["ts", "js"],

	// A map from regular expressions to paths to transformers
	transform: {
		"^.+\\.tsx?$": "babel-jest",
	},
}
