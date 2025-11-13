import { Response, Request } from 'express'
import { INotificationMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { NOTIFICATION_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseFind {

	constructor(
		@inject(NOTIFICATION_TYPES.RepositoryMongo) private readonly repository: INotificationMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		const pipeline = req.body
		await this.repository.find(pipeline, req, res)
	}

}
