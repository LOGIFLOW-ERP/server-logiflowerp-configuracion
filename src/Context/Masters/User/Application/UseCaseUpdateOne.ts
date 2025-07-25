import { inject, injectable } from 'inversify'
import { IUserMongoRepository } from '../Domain'
import { UpdateUserDTO } from 'logiflowerp-sdk'
import { USER_TYPES } from '../Infrastructure/IoC/types'

@injectable()
export class UseCaseUpdateOne {

	constructor(
		@inject(USER_TYPES.RepositoryMongo) private readonly repository: IUserMongoRepository,
	) { }

	async exec(id: string, dto: UpdateUserDTO) {

		const filter = { _id: id }
		const update = { $set: { password: dto.password } }

		return await this.repository.updateOne(filter, update)

	}

}
