import { Response, Request } from 'express'
import { ICompanyMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { COMPANY_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseGetAll {

	constructor(
		@inject(COMPANY_TYPES.RepositoryMongo) private readonly repositoryMongo: ICompanyMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		await this.repositoryMongo.find([{ $match: { isDeleted: false } }], req, res)
	}

}
