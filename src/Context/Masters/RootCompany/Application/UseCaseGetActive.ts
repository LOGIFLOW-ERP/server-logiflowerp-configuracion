import { Response, Request } from 'express'
import { IRootCompanyMongoRepository } from '../Domain'
import { State } from 'logiflowerp-sdk'

export class UseCaseGetActive {

	constructor(
		private readonly repository: IRootCompanyMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = [
			{ $match: { state: State.ACTIVO } },
			{ $project: { code: 1, ruc: 1, companyname: 1, _id: 0 } }
		]
		await this.repository.find(pipeline, req, res)
	}

}
