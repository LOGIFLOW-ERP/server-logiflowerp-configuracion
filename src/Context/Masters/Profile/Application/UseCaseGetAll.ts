import { Response, Request } from 'express'
import { IProfileMongoRepository } from '../Domain'

export class UseCaseGetAll {

	constructor(
		private readonly repository: IProfileMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		await this.repository.find([], req, res)
	}

}
