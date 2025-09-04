import { inject, injectable } from 'inversify'
import { IUserMongoRepository } from '../Domain'
import { UpdateUserDTO } from 'logiflowerp-sdk'
import { USER_TYPES } from '../Infrastructure/IoC/types'

@injectable()
export class UseCaseUpdateOne {

	constructor(
		@inject(USER_TYPES.RepositoryMongo) private readonly repository: IUserMongoRepository,
	) { }

	exec(_id: string, dto: UpdateUserDTO) {
		return this.repository.updateOne({ _id }, { $set: dto })
	}

}
