import { Response, Request } from 'express'
import { IPersonnelMongoRepository } from '../Domain'

export class UseCaseGetAll {

	constructor(
		private readonly repository: IPersonnelMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		await this.repository.find([], req, res)
	}

}
