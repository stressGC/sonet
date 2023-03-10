#!/usr/bin/env node
import { PostMessageUseCase, type PostMessageCommand } from "@application/use-cases/post-message.usecase"
import { RealDateProvider } from "@infra/RealDateProvider"
import { InMemoryMessageRepository } from "@infra/InMemoryMessageRepository"
import { Command } from "commander"

const messageRepository = new InMemoryMessageRepository()
const dateProvider = new RealDateProvider()
const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider)

const program = new Command()
program
	.version("1.0.0")
	.description("Crafty social network")
	.addCommand(
		new Command("post")
			.argument("<author>", "the current user")
			.argument("<message>", "the message to post")
			.action((author, message) => {
				const postMessageCommand: PostMessageCommand = {
					id: "some-message-id",
					author,
					message,
				}
				try {
					postMessageUseCase.handle(postMessageCommand)
					console.log("✅ Message posted")
					process.exit(0)
				} catch (err) {
					console.error("❌", err)
					process.exit(1)
				}
			}),
	)

async function main() {
	await program.parseAsync()
}

main()
