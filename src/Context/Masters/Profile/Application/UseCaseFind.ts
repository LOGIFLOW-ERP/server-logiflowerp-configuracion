import { Response, Request } from 'express'
import { inject, injectable } from 'inversify'
import { IProfileMongoRepository } from '../Domain'
import { PROFILE_TYPES } from '../Infrastructure/IoC/types'

@injectable()
export class UseCaseFind {

	constructor(
		@inject(PROFILE_TYPES.MongoRepository) private readonly repository: IProfileMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
