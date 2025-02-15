import { Response, Request } from 'express'
import { inject, injectable } from 'inversify'
import { IEndpointMongoRepository } from '../Domain'
import { ENDPOINT_TYPES } from '../Infrastructure'

@injectable()
export class UseCaseFind {

	constructor(
		@inject(ENDPOINT_TYPES.MongoRepository) private readonly repository: IEndpointMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
