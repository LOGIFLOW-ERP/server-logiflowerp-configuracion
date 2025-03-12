import { Response, Request } from 'express'
import { IRootCompanyMongoRepository } from '../Domain'

export class UseCaseGetAll {

	constructor(
		private readonly repository: IRootCompanyMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		await this.repository.find([], req, res)
	}

}
