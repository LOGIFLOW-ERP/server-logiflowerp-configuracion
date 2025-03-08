import { Response, Request } from 'express'
import { injectable } from 'inversify'
import { IRootCompanyMongoRepository } from '../Domain'

@injectable()
export class UseCaseGetAll {

	constructor(
		private readonly repository: IRootCompanyMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		await this.repository.find([], req, res)
	}

}
