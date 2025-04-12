import { Response, Request } from 'express'
import { IRootCompanyMongoRepository } from '../Domain'
import { State } from 'logiflowerp-sdk'
import { ROOT_COMPANY_TYPES } from '../Infrastructure/IoC'
import { inject, injectable } from 'inversify'

@injectable()
export class UseCaseGetActive {

	constructor(
		@inject(ROOT_COMPANY_TYPES.RepositoryMongo) private readonly repository: IRootCompanyMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = [
			{ $match: { state: State.ACTIVO } },
			{ $project: { code: 1, ruc: 1, companyname: 1, _id: 0 } }
		]
		await this.repository.find(pipeline, req, res)
	}

}
