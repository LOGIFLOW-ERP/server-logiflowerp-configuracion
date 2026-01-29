import { Response, Request } from 'express'
import { IUserMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { USER_TYPES } from '../Infrastructure/IoC'
import { CONFIG_TYPES } from '@Config/types'

@injectable()
export class UseCaseGetAll {

	constructor(
		@inject(USER_TYPES.RepositoryMongo) private readonly repository: IUserMongoRepository,
		@inject(CONFIG_TYPES.Env) private readonly env: Env
	) { }

	async exec(req: Request, res: Response) {
		await this.repository.find(
			[
				{ $match: { email: { $nin: this.env.DEVELOPERS_MAILS } } },
				{ $project: { password: 0 } }
			],
			req,
			res
		)
	}
}
