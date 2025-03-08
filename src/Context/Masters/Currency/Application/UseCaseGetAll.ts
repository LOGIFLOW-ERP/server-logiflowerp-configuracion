import { Response, Request } from 'express'
import { injectable } from 'inversify'
import { ICurrencyMongoRepository } from '../Domain'

@injectable()
export class UseCaseGetAll {

	constructor(
		private readonly repository: ICurrencyMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		await this.repository.find([], req, res)
	}

}
