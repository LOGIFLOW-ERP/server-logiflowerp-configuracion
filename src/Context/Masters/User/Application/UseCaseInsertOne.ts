import { inject, injectable } from 'inversify'
import { IUserMongoRepository } from '../Domain'
import { USER_TYPES } from '../Infrastructure'
import { UserENTITY } from 'logiflowerp-sdk'

@injectable()
export class UseCaseInsertOne {

	constructor(
		@inject(USER_TYPES.MongoRepository) private readonly repository: IUserMongoRepository,
	) { }

	async exec(entity: UserENTITY) {
		return await this.repository.insertOne(entity)
	}

}
