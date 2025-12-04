import { Response, Request } from 'express'
import { IPersonnelMongoRepository } from '../Domain'
import { PERSONNEL_TYPES } from '../Infrastructure/IoC'
import { inject, injectable } from 'inversify'

@injectable()
export class UseCaseFindIndividual {

	constructor(
		@inject(PERSONNEL_TYPES.RepositoryMongo) private readonly repository: IPersonnelMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(
			[
				...pipeline,
				{ $match: { identity: req.user.identity, isDeleted: false } }
			],
			req,
			res
		)
	}
}
