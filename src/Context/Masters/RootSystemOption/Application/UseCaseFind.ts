import { Response, Request } from 'express'
import { IRootSystemOptionMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { ROOT_SYSTEM_OPTION_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseFind {

	constructor(
		@inject(ROOT_SYSTEM_OPTION_TYPES.RepositoryMongo) private readonly repository: IRootSystemOptionMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
