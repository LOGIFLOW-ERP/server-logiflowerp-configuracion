import { Response, Request } from 'express'
import { ICompanyMongoRepository } from '../Domain'

export class UseCaseFind {

	constructor(
		private readonly repository: ICompanyMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
