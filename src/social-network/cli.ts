#!/usr/bin/env node
import { PostMessageUseCase, type PostMessageCommand } from "@application/use-cases/post-message.usecase"
import { RealDateProvider } from "@infra/providers/date.provider"
import { Command } from "commander"
import { FileSystemMessageRepository } from "@infra/repositories/message.filesystem.repository"
import { v4 as uuidv4 } from "uuid"
import { ViewTimelineUseCase } from "@application/use-cases/view-timeline.usecase"
import { EditMessageCommand, EditMessageUseCase } from "@application/use-cases/edit-message.usecase"

const messageRepository = new FileSystemMessageRepository()
const dateProvider = new RealDateProvider()
const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider)
const editMessageUseCase = new EditMessageUseCase(messageRepository)
const viewTimelineUseCase = new ViewTimelineUseCase(messageRepository, dateProvider)

const program = new Command()
program
	.version("1.0.0")
	.description("Crafty social network")
	.addCommand(
		new Command("post")
			.argument("<author>", "the current user")
			.argument("<message>", "the message to post")
			.action(async (author, message) => {
				const postMessageCommand: PostMessageCommand = {
					id: uuidv4(),
					author,
					message,
				}
				try {
					await postMessageUseCase.handle(postMessageCommand)
					console.log("✅ Message posted")
					process.exit(0)
				} catch (err) {
					console.error("❌", err)
					process.exit(1)
				}
			}),
	)
	.addCommand(
		new Command("edit")
			.argument("<message-id>", "the message id of the message to edit")
			.argument("<message>", "the new text")
			.action(async (messageId, message) => {
				const editMessageCommand: EditMessageCommand = {
					id: messageId,
					message,
				}
				try {
					await editMessageUseCase.handle(editMessageCommand)
					console.log("✅ Message edited")
					process.exit(0)
				} catch (err) {
					console.error("❌", err)
					process.exit(1)
				}
			}),
	)
	.addCommand(
		new Command("view").argument("<user>", "the user to view the timeline of").action(async (user) => {
			try {
				const timeline = await viewTimelineUseCase.handle({ user })
				console.table(timeline)
				process.exit(0)
			} catch (err) {
				console.error(err)
				process.exit(1)
			}
		}),
	)

async function main() {
	await program.parseAsync()
}

main()
