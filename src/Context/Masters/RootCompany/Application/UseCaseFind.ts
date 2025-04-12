import { Response, Request } from 'express'
import { IRootCompanyMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { ROOT_COMPANY_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseFind {

	constructor(
		@inject(ROOT_COMPANY_TYPES.RepositoryMongo) private readonly repository: IRootCompanyMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
