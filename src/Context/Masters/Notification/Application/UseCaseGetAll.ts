import { Response, Request } from 'express'
import { INotificationMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { NOTIFICATION_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseGetAll {

	constructor(
		@inject(NOTIFICATION_TYPES.RepositoryMongo) private readonly repository: INotificationMongoRepository,
	) { }

	async exec(req: Request, res: Response) {
		await this.repository.find(
			[
				{ $match: { usuarioId: req.user._id } },
				{ $sort: { fechaCreacion: -1 } }
			],
			req,
			res
		)
	}
}
