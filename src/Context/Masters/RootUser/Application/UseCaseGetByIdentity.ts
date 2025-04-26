import { State } from 'logiflowerp-sdk'
import { IRootUserMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { ROOT_USER_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseGetByIdentity {

	constructor(
		@inject(ROOT_USER_TYPES.RepositoryMongo) private readonly repository: IRootUserMongoRepository,
	) { }

	async exec(identity: string) {
		const pipeline = [{ $match: { identity, state: State.ACTIVO } }]
		const result = await this.repository.selectOne(pipeline)
		const { password, root, emailVerified, state, _id, ...user } = result
		return user
	}

}
