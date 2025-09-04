import { Response, Request } from 'express'
import { IUserMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { USER_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseGetAll {

	constructor(
		@inject(USER_TYPES.RepositoryMongo) private readonly repository: IUserMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		await this.repository.find([{ $match: {} }, { $project: { password: 0 } }], req, res)
	}

}
