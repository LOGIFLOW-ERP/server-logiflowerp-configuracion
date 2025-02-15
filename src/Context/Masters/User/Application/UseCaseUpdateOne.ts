import { inject, injectable } from 'inversify'
import { IUserMongoRepository } from '../Domain'
import { USER_TYPES } from '../Infrastructure'
import { ObjectId } from 'mongodb'
import { UserENTITY } from 'logiflowerp-sdk'

@injectable()
export class UseCaseUpdateOne {

	constructor(
		@inject(USER_TYPES.MongoRepository) private readonly repository: IUserMongoRepository,
	) { }

	async exec(id: ObjectId, dto: UserENTITY) {

		const filter = { _id: id }
		const update = { $set: { nombres: dto.nombres } }

		return await this.repository.updateOne(filter, update)

	}

}
