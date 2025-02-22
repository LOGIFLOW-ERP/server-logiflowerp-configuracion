import { Response, Request } from 'express'
import { inject, injectable } from 'inversify'
import { ISystemOptionMongoRepository } from '../Domain'
import { SYSTEM_OPTION_TYPES } from '../Infrastructure/IoC/types'

@injectable()
export class UseCaseFind {

	constructor(
		@inject(SYSTEM_OPTION_TYPES.MongoRepository) private readonly repository: ISystemOptionMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
