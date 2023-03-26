import { userBuilder } from "@domain/__tests__/user.builder"
import type { User } from "@domain/user"
import { PasswordMismatchError } from "@domain/user"
import { InvalidPasswordError } from "@domain/user"
import { InvalidUsernameError } from "@domain/user"
import { InMemoryUserRepository } from "@infra/repositories/user.inmemory.repository"

import type { SignUpCommand } from "../sign-up.usecase"
import { SignUpUseCase } from "../sign-up.usecase"

describe("Feature: ability to sign up", () => {
	let fixture: ReturnType<typeof createFixture>
	beforeEach(() => {
		fixture = createFixture()
	})

	describe("Rule: must specify a valid username", () => {
		test("Bob signs up with valid username 'bob39'", async () => {
			fixture.givenNoExistingUsers()

			await fixture.whenSigningUpWith("bob39", "validpassword", "validpassword")

			fixture.thenUsersShouldBe([userBuilder().withUsername("bob39").withPassword("validpassword").build()])
		})

		test("Bob can't sign up with an invalid username containing invalid characters 'bob@39'", async () => {
			fixture.givenNoExistingUsers()

			await fixture.whenSigningUpWith("bob@39", "validpassword", "validpassword")

			fixture.thenErrorShouldBe(InvalidUsernameError)
		})

		test("Bob can't sign up with an invalid username containing too few characters 'bob'", async () => {
			fixture.givenNoExistingUsers()

			await fixture.whenSigningUpWith("bob", "validpassword", "validpassword")

			fixture.thenErrorShouldBe(InvalidUsernameError)
		})

		test("Bob can't sign up with an invalid username containing many characters", async () => {
			fixture.givenNoExistingUsers()

			await fixture.whenSigningUpWith("bob".repeat(50), "validpassword", "validpassword")

			fixture.thenErrorShouldBe(InvalidUsernameError)
		})

		test("Bob can't sign up with an invalid username containing uppercase letters", async () => {
			fixture.givenNoExistingUsers()

			await fixture.whenSigningUpWith("Bobby", "validpassword", "validpassword")

			fixture.thenErrorShouldBe(InvalidUsernameError)
		})
	})

	describe("Rule: must specify a valid password", () => {
		test("Bob signs up with valid password 'bobbypassword'", async () => {
			fixture.givenNoExistingUsers()

			await fixture.whenSigningUpWith("bob39", "bobbypassword", "bobbypassword")

			fixture.thenUsersShouldBe([userBuilder().withUsername("bob39").withPassword("bobbypassword").build()])
		})

		test("Bob can't sign up with invalid password with too few characters 'pass'", async () => {
			const tooShortPassword = "pass"
			fixture.givenNoExistingUsers()

			await fixture.whenSigningUpWith("bob39", tooShortPassword, tooShortPassword)

			fixture.thenErrorShouldBe(InvalidPasswordError)
		})

		test("Bob can't sign up with an invalid password with too many characters", async () => {
			const tooLongPassword = "pass".repeat(20)
			fixture.givenNoExistingUsers()

			await fixture.whenSigningUpWith("bob39", tooLongPassword, tooLongPassword)

			fixture.thenErrorShouldBe(InvalidPasswordError)
		})
	})

	describe("Rule: the confirmation password must match the password", () => {
		test("Bob signs up with matching password and confirmation password", async () => {
			fixture.givenNoExistingUsers()

			await fixture.whenSigningUpWith("bob39", "bobbypassword", "bobbypassword")

			fixture.thenUsersShouldBe([userBuilder().withUsername("bob39").withPassword("bobbypassword").build()])
		})

		test("Bob can't sign up with mismatching passwords", async () => {
			fixture.givenNoExistingUsers()

			await fixture.whenSigningUpWith("bob39", "bobbypassword", "otherbobbypassword")

			fixture.thenErrorShouldBe(PasswordMismatchError)
		})
	})
})

function createFixture() {
	const inMemoryUserRepository = new InMemoryUserRepository()
	const signUpUseCase = new SignUpUseCase(inMemoryUserRepository)
	let error: unknown

	return {
		givenNoExistingUsers() {
			inMemoryUserRepository.setExistingUsers([])
		},
		async whenSigningUpWith(username: string, password: string, passwordConfirmation: string) {
			const command: SignUpCommand = {
				username,
				password,
				passwordConfirmation,
			}
			try {
				await signUpUseCase.handle(command)
			} catch (_error) {
				error = _error
			}
		},
		thenUsersShouldBe(expectedUsers: User[]) {
			expect(inMemoryUserRepository.users).toStrictEqual(expectedUsers)
		},
		thenErrorShouldBe(errorInstance: new () => Error) {
			expect(error).toBeInstanceOf(errorInstance)
		},
	}
}
