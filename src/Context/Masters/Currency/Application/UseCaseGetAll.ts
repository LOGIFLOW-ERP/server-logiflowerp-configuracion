import { Response, Request } from 'express'
import { ICurrencyMongoRepository } from '../Domain'

export class UseCaseGetAll {

	constructor(
		private readonly repository: ICurrencyMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		await this.repository.find([], req, res)
	}

}
