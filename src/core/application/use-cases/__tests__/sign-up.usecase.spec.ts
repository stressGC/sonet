import { userBuilder } from "@domain/__tests__/user.builder"
import { PasswordMismatchError } from "@domain/user"
import { InvalidPasswordError } from "@domain/user"
import { InvalidUsernameError } from "@domain/user"

import { UnavailableUsernameError } from "../sign-up.usecase"
import type { RegisteringFixture } from "./registering.fixture"
import { createRegisteringFixture } from "./registering.fixture"

describe("Feature: ability to sign up", () => {
	let registeringFixture: RegisteringFixture
	beforeEach(() => {
		registeringFixture = createRegisteringFixture()
	})

	describe("Rule: must specify a valid username", () => {
		test("Bob signs up with valid username 'bob39'", async () => {
			registeringFixture.givenNoExistingUsers()

			await registeringFixture.whenSigningUpWith("bob39", "validpassword", "validpassword")

			registeringFixture.thenUsersShouldBe([
				userBuilder().withUsername("bob39").withPassword("validpassword").build(),
			])
		})

		test("Bob can't sign up with an invalid username containing invalid characters 'bob@39'", async () => {
			registeringFixture.givenNoExistingUsers()

			await registeringFixture.whenSigningUpWith("bob@39", "validpassword", "validpassword")

			registeringFixture.thenErrorShouldBe(InvalidUsernameError)
		})

		test("Bob can't sign up with an invalid username containing too few characters 'bob'", async () => {
			registeringFixture.givenNoExistingUsers()

			await registeringFixture.whenSigningUpWith("b", "validpassword", "validpassword")

			registeringFixture.thenErrorShouldBe(InvalidUsernameError)
		})

		test("Bob can't sign up with an invalid username containing many characters", async () => {
			registeringFixture.givenNoExistingUsers()

			await registeringFixture.whenSigningUpWith("bob".repeat(50), "validpassword", "validpassword")

			registeringFixture.thenErrorShouldBe(InvalidUsernameError)
		})

		test("Bob can't sign up with an invalid username containing uppercase letters", async () => {
			registeringFixture.givenNoExistingUsers()

			await registeringFixture.whenSigningUpWith("Bobby", "validpassword", "validpassword")

			registeringFixture.thenErrorShouldBe(InvalidUsernameError)
		})
	})

	describe("Rule: must specify a valid password", () => {
		test("Bob signs up with valid password 'bobbypassword'", async () => {
			registeringFixture.givenNoExistingUsers()

			await registeringFixture.whenSigningUpWith("bob39", "bobbypassword", "bobbypassword")

			registeringFixture.thenUsersShouldBe([
				userBuilder().withUsername("bob39").withPassword("bobbypassword").build(),
			])
		})

		test("Bob can't sign up with invalid password with too few characters 'pass'", async () => {
			const tooShortPassword = "pass"
			registeringFixture.givenNoExistingUsers()

			await registeringFixture.whenSigningUpWith("bob39", tooShortPassword, tooShortPassword)

			registeringFixture.thenErrorShouldBe(InvalidPasswordError)
		})

		test("Bob can't sign up with an invalid password with too many characters", async () => {
			const tooLongPassword = "pass".repeat(20)
			registeringFixture.givenNoExistingUsers()

			await registeringFixture.whenSigningUpWith("bob39", tooLongPassword, tooLongPassword)

			registeringFixture.thenErrorShouldBe(InvalidPasswordError)
		})
	})

	describe("Rule: the confirmation password must match the password", () => {
		test("Bob signs up with matching password and confirmation password", async () => {
			registeringFixture.givenNoExistingUsers()

			await registeringFixture.whenSigningUpWith("bob39", "bobbypassword", "bobbypassword")

			registeringFixture.thenUsersShouldBe([
				userBuilder().withUsername("bob39").withPassword("bobbypassword").build(),
			])
		})

		test("Bob can't sign up with mismatching passwords", async () => {
			registeringFixture.givenNoExistingUsers()

			await registeringFixture.whenSigningUpWith("bob39", "bobbypassword", "otherbobbypassword")

			registeringFixture.thenErrorShouldBe(PasswordMismatchError)
		})
	})

	describe("Rule: the username must be available", () => {
		test("Bob signs up with an available username", async () => {
			registeringFixture.givenExistingUsers([
				userBuilder().withUsername("alice").withPassword("alicepassword").build(),
			])

			await registeringFixture.whenSigningUpWith("bob39", "bobbypassword", "bobbypassword")

			registeringFixture.thenUsersShouldBe([
				userBuilder().withUsername("alice").withPassword("alicepassword").build(),
				userBuilder().withUsername("bob39").withPassword("bobbypassword").build(),
			])
		})

		test("Bob can't sign up with a username that already exists", async () => {
			registeringFixture.givenExistingUsers([
				userBuilder().withUsername("bob39").withPassword("bobpassword").build(),
			])

			await registeringFixture.whenSigningUpWith("bob39", "bobbypassword", "bobbypassword")

			registeringFixture.thenErrorShouldBe(UnavailableUsernameError)
		})
	})
})
