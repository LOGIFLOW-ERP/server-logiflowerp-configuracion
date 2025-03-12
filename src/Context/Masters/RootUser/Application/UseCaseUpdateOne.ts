import { IRootUserMongoRepository } from '../Domain'
import { UserENTITY } from 'logiflowerp-sdk'

export class UseCaseUpdateOne {

	constructor(
		private readonly repository: IRootUserMongoRepository,
	) { }

	async exec(id: string, dto: UserENTITY) {

		const filter = { _id: id }
		const update = { $set: { names: dto.names } }

		return await this.repository.updateOne(filter, update)

	}

}
