import { State } from 'logiflowerp-sdk'
import { IRootUserMongoRepository } from '../Domain'
import { ConflictException, NotFoundException } from '@Config/exception'
import { inject, injectable } from 'inversify'
import { ROOT_USER_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseGetByIdentity {

	constructor(
		@inject(ROOT_USER_TYPES.RepositoryMongo) private readonly repository: IRootUserMongoRepository,
	) { }

	async exec(identity: string) {
		const pipeline = [{ $match: { identity, state: State.ACTIVO } }]
		const result = await this.repository.select(pipeline)
		if (!result.length) {
			throw new NotFoundException(`Usuario con identificación "${identity}" aún no está registrado o está inactivo`, true)
		}
		if (result.length > 1) {
			throw new ConflictException(`Hay mas de un resultado para usuario con identificación "${identity}"`)
		}
		const { password, root, emailVerified, state, _id, ...user } = result[0]
		return user
	}

}
