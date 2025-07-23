import { Response, Request } from 'express'
import { IRootUserMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { ROOT_USER_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseFind {

	constructor(
		@inject(ROOT_USER_TYPES.RepositoryMongo) private readonly repository: IRootUserMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
