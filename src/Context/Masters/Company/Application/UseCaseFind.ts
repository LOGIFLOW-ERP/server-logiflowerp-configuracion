import { Response, Request } from 'express'
import { inject, injectable } from 'inversify'
import { ICompanyMongoRepository } from '../Domain'
import { COMPANY_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseFind {

	constructor(
		@inject(COMPANY_TYPES.MongoRepository) private readonly repository: ICompanyMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
