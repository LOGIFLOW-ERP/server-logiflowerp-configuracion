import { Response, Request } from 'express'
import { IProfileMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { PROFILE_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseGetAll {

	constructor(
		@inject(PROFILE_TYPES.RepositoryMongo) private readonly repository: IProfileMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		await this.repository.find([{ $match: { isDeleted: false } }], req, res)
	}

}
