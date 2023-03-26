// eslint-disable-next-line @typescript-eslint/ban-types
export class InMemoryRepositoryHelper<EntityType> {
	private _entities: EntityType[] = []

	constructor(private readonly getPrimaryKey?: (entity: EntityType) => string) {}

	public async saveOne(entity: EntityType) {
		let existingEntities = this._entities

		const _getPrimaryKey = this.getPrimaryKey
		if (_getPrimaryKey) {
			existingEntities = existingEntities.filter(
				(existingEntity) => _getPrimaryKey(existingEntity) !== _getPrimaryKey(entity),
			)
		}
		this._entities = [...existingEntities, entity]
	}

	public removeByPredicate(predicate: (entities: EntityType) => boolean) {
		this._entities = this._entities.filter(predicate)
	}

	public setExisting(existingEntities: EntityType[]) {
		this._entities = existingEntities
	}

	public filterByPredicate(predicate: (entities: EntityType) => boolean) {
		return this._entities.filter(predicate)
	}

	public findByPredicate(predicate: (entities: EntityType) => boolean): EntityType | null {
		return this._entities.find(predicate) ?? null
	}

	public get entities() {
		return this._entities
	}
}
