import { Response, Request } from 'express'
import { IPersonnelMongoRepository } from '../Domain'

export class UseCaseFind {

	constructor(
		private readonly repository: IPersonnelMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
