export class User {
	private constructor(private readonly username: string, private readonly password: string) {}

	public static register(username: string, password: string, passwordConfirmation: string) {
		const validatedUsername = this.validateUsername(username)
		const validatedPassword = this.validatePassword(password)

		if (!this.checkPasswordMatch(password, passwordConfirmation)) {
			throw new PasswordMismatchError()
		}

		return new User(validatedUsername, validatedPassword)
	}

	public static fromProperties(username: string, password: string) {
		return new User(username, password)
	}

	public get properties() {
		return {
			username: this.username,
			password: this.password,
		}
	}

	private static validateUsername(username: string) {
		const usernameValidationRegex = new RegExp(/^([a-z|\d]){3,20}$/)
		if (!usernameValidationRegex.test(username)) {
			throw new InvalidUsernameError()
		}
		return username
	}

	private static validatePassword(password: string) {
		if (password.length < 8 || password.length > 30) {
			throw new InvalidPasswordError()
		}
		return password
	}

	private static checkPasswordMatch(password: string, passwordConfirmation: string) {
		return password === passwordConfirmation
	}
}

export class InvalidUsernameError extends Error {}
export class InvalidPasswordError extends Error {}
export class PasswordMismatchError extends Error {}
