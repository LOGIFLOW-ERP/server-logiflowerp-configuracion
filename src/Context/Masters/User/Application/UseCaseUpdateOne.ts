import { inject, injectable } from 'inversify'
import { IRootUserMongoRepository } from '../Domain'
import { UpdateUserDTO } from 'logiflowerp-sdk'
import { ROOT_USER_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseUpdateOne {

	constructor(
		@inject(ROOT_USER_TYPES.RepositoryMongo) private readonly repository: IRootUserMongoRepository,
	) { }

	async exec(id: string, dto: UpdateUserDTO) {

		const filter = { _id: id }
		const update = { $set: { password: dto.password } }

		return await this.repository.updateOne(filter, update)

	}

}
