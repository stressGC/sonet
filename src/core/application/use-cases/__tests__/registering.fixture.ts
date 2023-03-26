import type { User } from "@domain/user"
import { InMemoryUserRepository } from "@infra/repositories/user.inmemory.repository"

import type { SignUpCommand } from "../sign-up.usecase"
import { SignUpUseCase } from "../sign-up.usecase"

export function createRegisteringFixture() {
	const userRepository = new InMemoryUserRepository()
	const signUpUseCase = new SignUpUseCase(userRepository)
	let error: unknown

	return {
		givenNoExistingUsers() {
			userRepository.setExistingUsers([])
		},
		givenExistingUsers(existingUsers: User[]) {
			userRepository.setExistingUsers(existingUsers)
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
			expect(userRepository.users).toStrictEqual(expectedUsers)
		},
		thenErrorShouldBe(errorInstance: new () => Error) {
			expect(error).toBeInstanceOf(errorInstance)
		},
		userRepository,
	}
}

export type RegisteringFixture = ReturnType<typeof createRegisteringFixture>
