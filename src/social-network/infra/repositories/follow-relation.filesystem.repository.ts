import * as fs from "fs/promises"
import path from "path"
import { constants } from "fs"
import type { FollowRelationRepository } from "@application/repositories/follow-relations.repository"
import type { FollowRelation } from "@domain/follow-relation"

export class FileSystemFollowRelationRepository implements FollowRelationRepository {
	constructor(
		private readonly filePath: string = path.join(__dirname, "./follow-relation.filesystem.repository.json"),
	) {}

	public async save(followRelation: FollowRelation) {
		const followRelations = await this.getFollowRelations()
		await this.saveFollowRelations([...followRelations, followRelation])
	}

	public async getFolloweesOf(user: string) {
		const followRelations = await this.getFollowRelations()
		return followRelations
			.filter((followRelation) => followRelation.follower === user)
			.map((followRelation) => followRelation.followee)
	}

	private async saveFollowRelations(followRelations: FollowRelation[]) {
		await fs.writeFile(this.filePath, JSON.stringify(followRelations))
	}

	private async getFollowRelations(): Promise<Array<FollowRelation>> {
		await this.initializeFile()
		const fileContent = await fs.readFile(this.filePath)
		const persistedFollowRelations = JSON.parse(fileContent.toString()) as Array<FollowRelation>
		return persistedFollowRelations
	}

	private async initializeFile() {
		try {
			await fs.access(this.filePath, constants.R_OK | constants.W_OK)
		} catch (err) {
			await fs.writeFile(this.filePath, JSON.stringify([]))
		}
	}
}
