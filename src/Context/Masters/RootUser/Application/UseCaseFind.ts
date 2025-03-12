import { Response, Request } from 'express'
import { IRootUserMongoRepository } from '../Domain'

export class UseCaseFind {

	constructor(
		private readonly repository: IRootUserMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
