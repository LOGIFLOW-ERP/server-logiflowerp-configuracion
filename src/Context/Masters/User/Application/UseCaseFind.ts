import { Response, Request } from 'express'
import { inject, injectable } from 'inversify'
import { IUserMongoRepository } from '../Domain'
import { USER_TYPES } from '../Infrastructure'

@injectable()
export class UseCaseFind {

	constructor(
		@inject(USER_TYPES.MongoRepository) private readonly repository: IUserMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
