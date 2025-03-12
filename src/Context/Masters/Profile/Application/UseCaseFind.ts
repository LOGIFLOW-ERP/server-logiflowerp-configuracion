import { Response, Request } from 'express'
import { IProfileMongoRepository } from '../Domain'

export class UseCaseFind {

	constructor(
		private readonly repository: IProfileMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
