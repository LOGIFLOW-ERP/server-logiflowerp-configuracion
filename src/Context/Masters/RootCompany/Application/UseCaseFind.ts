import { Response, Request } from 'express'
import { IRootCompanyMongoRepository } from '../Domain'

export class UseCaseFind {

	constructor(
		private readonly repository: IRootCompanyMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
