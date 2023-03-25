#!/usr/bin/env node
import { Command } from "commander"
import { v4 as uuidv4 } from "uuid"
import { RealDateProvider } from "@infra/providers/date.provider"
import { FileSystemMessageRepository } from "@infra/repositories/message.filesystem.repository"
import { FileSystemFollowRelationRepository } from "@infra/repositories/follow-relation.filesystem.repository"
import type { ViewTimelineCommand } from "@application/use-cases/view-timeline.usecase"
import { ViewTimelineUseCase } from "@application/use-cases/view-timeline.usecase"
import type { PostMessageCommand } from "@application/use-cases/post-message.usecase"
import { PostMessageUseCase } from "@application/use-cases/post-message.usecase"
import type { EditMessageCommand } from "@application/use-cases/edit-message.usecase"
import { EditMessageUseCase } from "@application/use-cases/edit-message.usecase"
import type { FollowUserCommand } from "@application/use-cases/follow-user.usecase"
import { FollowUserUseCase } from "@application/use-cases/follow-user.usecase"
import type { UnfollowUserCommand } from "@application/use-cases/unfollow-user.usecase"
import { UnfollowUserUseCase } from "@application/use-cases/unfollow-user.usecase"

const followRelationsRepository = new FileSystemFollowRelationRepository()
const messageRepository = new FileSystemMessageRepository()

const dateProvider = new RealDateProvider()

const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider)
const editMessageUseCase = new EditMessageUseCase(messageRepository)
const viewTimelineUseCase = new ViewTimelineUseCase(messageRepository, dateProvider)
const followUserUseCase = new FollowUserUseCase(followRelationsRepository)
const unfollowUserUseCase = new UnfollowUserUseCase(followRelationsRepository)

const program = new Command()
program
	.version("1.0.0")
	.description("Sonet")
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
			const viewTimelineCommand: ViewTimelineCommand = { user }
			try {
				const timeline = await viewTimelineUseCase.handle(viewTimelineCommand)
				console.table(timeline)
				process.exit(0)
			} catch (err) {
				console.error(err)
				process.exit(1)
			}
		}),
	)
	.addCommand(
		new Command("follow")
			.argument("<follower>", "user that follows")
			.argument("<followee>", "user that is being followed")
			.action(async (follower, followee) => {
				const followUserCommand: FollowUserCommand = {
					follower,
					followee,
				}
				try {
					await followUserUseCase.handle(followUserCommand)
					console.log(`✅ ${followUserCommand.follower} successfully followed ${followUserCommand.followee}`)
					process.exit(0)
				} catch (err) {
					console.error("❌", err)
					process.exit(1)
				}
			}),
	)
	.addCommand(
		new Command("unfollow")
			.argument("<follower>", "user wanting to unfollow")
			.argument("<followee>", "user to unfollow")
			.action(async (follower, followee) => {
				const unfollowUserCommand: UnfollowUserCommand = {
					follower,
					followee,
				}
				try {
					await unfollowUserUseCase.handle(unfollowUserCommand)
					console.log(
						`✅ ${unfollowUserCommand.follower} successfully unfollowed ${unfollowUserCommand.followee}`,
					)
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
