import { Response, Request } from 'express'
import { IRootCompanyMongoRepository } from '../Domain'
import { ROOT_COMPANY_TYPES } from '../Infrastructure/IoC'
import { inject, injectable } from 'inversify'

@injectable()
export class UseCaseGetAll {

	constructor(
		@inject(ROOT_COMPANY_TYPES.RepositoryMongo) private readonly repository: IRootCompanyMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		await this.repository.find([], req, res)
	}

}
