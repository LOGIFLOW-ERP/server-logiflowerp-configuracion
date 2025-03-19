import { IRootUserMongoRepository } from '../Domain'
import { UpdateUserDTO } from 'logiflowerp-sdk'

export class UseCaseUpdateOne {

	constructor(
		private readonly repository: IRootUserMongoRepository,
	) { }

	async exec(id: string, dto: UpdateUserDTO) {

		const filter = { _id: id }
		const update = { $set: { password: dto.password } }

		return await this.repository.updateOne(filter, update)

	}

}
