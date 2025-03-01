import { Response, Request } from 'express'
import { inject, injectable } from 'inversify'
import { ICurrencyMongoRepository } from '../Domain'
import { CURRENCY_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseFind {

	constructor(
		@inject(CURRENCY_TYPES.MongoRepository) private readonly repository: ICurrencyMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
