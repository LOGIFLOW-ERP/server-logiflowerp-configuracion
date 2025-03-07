import { Response, Request } from 'express'
import { inject, injectable } from 'inversify'
import { ICompanyMongoRepository } from '../Domain'
import { COMPANY_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseGetAll {

	constructor(
		@inject(COMPANY_TYPES.MongoRepository) private readonly repository: ICompanyMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		await this.repository.find([], req, res)
	}

}
