/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
	preset: "ts-jest",
	testMatch: ["**/*.(spec|test).ts?(x)"],
	rootDir: "./src",
	moduleNameMapper: {
		"^@application(.*)$": "<rootDir>/core/application/$1",
		"^@domain(.*)$": "<rootDir>/core/domain/$1",
		"^@infra(.*)$": "<rootDir>/core/infra/$1",
	},
}
