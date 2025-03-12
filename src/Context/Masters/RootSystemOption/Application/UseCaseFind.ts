import { Response, Request } from 'express'
import { IRootSystemOptionMongoRepository } from '../Domain'

export class UseCaseFind {

	constructor(
		private readonly repository: IRootSystemOptionMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
