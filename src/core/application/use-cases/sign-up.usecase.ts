import type { UserRepository } from "@application/repositories/user.repository"
import { User } from "@domain/user"

export type SignUpCommand = {
	username: string
	password: string
	passwordConfirmation: string
}
export class SignUpUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async handle(command: SignUpCommand) {
		const newUser = User.register(command.username, command.password, command.passwordConfirmation)
		await this.userRepository.save(newUser)
	}
}
