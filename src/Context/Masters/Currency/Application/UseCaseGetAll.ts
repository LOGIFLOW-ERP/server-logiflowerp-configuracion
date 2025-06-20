import { Response, Request } from 'express'
import { ICurrencyMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { CURRENCY_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseGetAll {

	constructor(
		@inject(CURRENCY_TYPES.RepositoryMongo) private readonly repository: ICurrencyMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		await this.repository.find([{ $match: { isDeleted: false } }], req, res)
	}

}
