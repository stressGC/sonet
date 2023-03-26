import { User } from "@domain/user"

export function userBuilder({
	username = "defaultusername",
	password = "defaultpassword",
}: {
	username?: string
	password?: string
	passwordConfirmation?: string
} = {}) {
	const props = {
		username,
		password,
	}
	return {
		withUsername(_username: string) {
			return userBuilder({ ...props, username: _username })
		},
		withPassword(_password: string) {
			return userBuilder({ ...props, password: _password })
		},
		build() {
			return User.register(props.username, props.password, props.password)
		},
	}
}
