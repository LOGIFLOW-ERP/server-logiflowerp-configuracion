import { Response, Request } from 'express'
import { ICompanyMongoRepository } from '../Domain'

export class UseCaseGetAll {

	constructor(
		private readonly repository: ICompanyMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		await this.repository.find([], req, res)
	}

}
