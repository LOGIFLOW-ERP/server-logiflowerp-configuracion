import { Response, Request } from 'express'
import { injectable } from 'inversify'
import { ICurrencyMongoRepository } from '../Domain'

@injectable()
export class UseCaseFind {

	constructor(
		private readonly repository: ICurrencyMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
