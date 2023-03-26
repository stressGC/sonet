import { constants } from "fs"
import * as fs from "fs/promises"

export class FileSystemRepositoryHelper<EntityType, SerializedEntityType> {
	public constructor(
		private readonly filePath: string,
		private readonly serialize: (entity: EntityType) => SerializedEntityType = (data) =>
			data as unknown as SerializedEntityType,
		private readonly deserialize: (data: SerializedEntityType) => EntityType = (data) =>
			data as unknown as EntityType,
	) {}

	public async saveOne(entity: EntityType) {
		const entities = await this.getAllEntities()
		await this.saveAllEntites([...entities, entity])
	}

	public async saveAllEntites(entities: EntityType[]) {
		await fs.writeFile(this.filePath, JSON.stringify(entities.map(this.serialize)))
	}

	public async getAllEntities(): Promise<EntityType[]> {
		await this.initializeFile()
		const fileContent = await fs.readFile(this.filePath)
		const entities = JSON.parse(fileContent.toString()) as SerializedEntityType[]
		return entities.map(this.deserialize)
	}

	private async initializeFile() {
		try {
			await fs.access(this.filePath, constants.R_OK | constants.W_OK)
		} catch (err) {
			await fs.writeFile(this.filePath, JSON.stringify([]))
		}
	}
}
