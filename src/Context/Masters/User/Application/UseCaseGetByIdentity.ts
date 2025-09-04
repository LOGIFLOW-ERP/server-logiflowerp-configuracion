import { State } from 'logiflowerp-sdk'
import { IUserMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { USER_TYPES } from '../Infrastructure/IoC/types'
import { NotFoundException } from '@Config/exception'

@injectable()
export class UseCaseGetByIdentity {

	constructor(
		@inject(USER_TYPES.RepositoryMongo) private readonly repository: IUserMongoRepository,
	) { }

	async exec(identity: string) {
		const pipeline = [{ $match: { identity, state: State.ACTIVO, isDeleted: false } }]
		const result = await this.repository.select(pipeline)
		if (!result.length) {
			throw new NotFoundException('Usuario con identidad ' + identity + ' no tiene una cuenta.', true)
		}
		if (result[0].state === State.INACTIVO) {
			throw new NotFoundException('Usuario con identidad ' + identity + ' tiene una cuenta inactiva.', true)
		}
		const { password, root, emailVerified, state, _id, ...user } = result[0]
		return user
	}

}
