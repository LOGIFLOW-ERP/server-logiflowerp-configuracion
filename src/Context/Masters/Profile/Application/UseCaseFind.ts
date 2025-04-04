import { Response, Request } from 'express'
import { IProfileMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { PROFILE_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseFind {

	constructor(
		@inject(PROFILE_TYPES.RepositoryMongo) private readonly repository: IProfileMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
