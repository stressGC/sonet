/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
	preset: "ts-jest",
	testMatch: ["**/*.(spec|test).ts?(x)"],
	rootDir: "./src",
	moduleNameMapper: {
		"^@application(.*)$": "<rootDir>/social-network/application/$1",
		"^@domain(.*)$": "<rootDir>/social-network/domain/$1",
		"^@infra(.*)$": "<rootDir>/social-network/infra/$1",
	},
}
