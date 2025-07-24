import { Response, Request } from 'express'
import { IUserMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { USER_TYPES } from '../Infrastructure/IoC/types'

@injectable()
export class UseCaseFind {

	constructor(
		@inject(USER_TYPES.RepositoryMongo) private readonly repository: IUserMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		const _pipeline = [...pipeline, { $project: { password: 0 } }]
		await this.repository.find(_pipeline, req, res)
	}

}
