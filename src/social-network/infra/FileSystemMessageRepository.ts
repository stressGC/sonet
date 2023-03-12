import * as fs from "fs/promises"
import type { MessageRepository } from "@application/repositories/message.repository"
import type { Message } from "@domain/message"

export class FileSystemMessageRepository implements MessageRepository {
	constructor(private readonly filePath: string) {}

	public async save(message: Message) {
		const existingMessages = await this.getMessages()
		await this.saveMessages([...existingMessages, message.properties])
	}

	private saveMessages(messages: Message["properties"][]) {
		console.log(this.filePath)
		return fs.writeFile(this.filePath, JSON.stringify(messages))
	}

	private async getMessages(): Promise<Message["properties"][]> {
		const fileContent = await fs.readFile(this.filePath)
		return JSON.parse(fileContent.toString())
	}
}
