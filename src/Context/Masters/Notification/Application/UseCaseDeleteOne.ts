import { INotificationMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { NOTIFICATION_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseDeleteOne {

    constructor(
        @inject(NOTIFICATION_TYPES.RepositoryMongo) private readonly repository: INotificationMongoRepository,
    ) { }

    async exec(_id: string) {
        return this.repository.deleteOne({ _id })
    }

}