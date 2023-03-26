import type { FollowRelationRepository } from "@application/repositories/follow-relations.repository"
import type { FollowRelation } from "@domain/follow-relation"
import path from "path"

import { FileSystemRepositoryHelper } from "./filesystem.repository.helper"

export class FileSystemFollowRelationRepository
	extends FileSystemRepositoryHelper<FollowRelation, FollowRelation>
	implements FollowRelationRepository
{
	constructor(filePath: string = path.join(__dirname, "./user.filesystem.repository.json")) {
		super(filePath)
	}

	public async save(followRelation: FollowRelation) {
		await this.saveOne(followRelation)
	}

	public async remove(followRelationToRemove: FollowRelation) {
		const followRelations = await this.getAllEntities()
		await this.saveAllEntites(
			followRelations.filter(
				(followRelation) =>
					followRelationToRemove.followee !== followRelation.followee ||
					followRelationToRemove.follower !== followRelation.follower,
			),
		)
	}

	public async getFolloweesOf(user: string) {
		const followRelations = await this.getAllEntities()
		return followRelations
			.filter((followRelation) => followRelation.follower === user)
			.map((followRelation) => followRelation.followee)
	}
}
