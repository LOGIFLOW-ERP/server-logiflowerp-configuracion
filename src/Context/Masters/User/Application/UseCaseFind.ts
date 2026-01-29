import { Response, Request } from 'express'
import { IUserMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { USER_TYPES } from '../Infrastructure/IoC/types'
import { CONFIG_TYPES } from '@Config/types'

@injectable()
export class UseCaseFind {

	constructor(
		@inject(USER_TYPES.RepositoryMongo) private readonly repository: IUserMongoRepository,
		@inject(CONFIG_TYPES.Env) private readonly env: Env
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		const _pipeline = [...pipeline, { $project: { password: 0 } }, { $match: { email: { $nin: this.env.DEVELOPERS_MAILS } } }]
		await this.repository.find(_pipeline, req, res)
	}
}
