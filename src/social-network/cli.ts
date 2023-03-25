#!/usr/bin/env node
import { PostMessageUseCase, type PostMessageCommand } from "@application/use-cases/post-message.usecase"
import { RealDateProvider } from "@infra/providers/date.provider"
import { Command } from "commander"
import { FileSystemMessageRepository } from "@infra/repositories/message.filesystem.repository"
import { v4 as uuidv4 } from "uuid"

const messageRepository = new FileSystemMessageRepository()
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
					id: uuidv4(),
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
