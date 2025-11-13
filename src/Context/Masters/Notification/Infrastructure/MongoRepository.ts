import { MongoRepository, SHARED_TYPES } from '@Shared/Infrastructure'
import { INotificationMongoRepository } from '../Domain'
import { AuthUserDTO, NotificationENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'

@injectable()
export class NotificationMongoRepository extends MongoRepository<NotificationENTITY> implements INotificationMongoRepository {

    constructor(
        @inject('collection') protected readonly collection: string,
        @inject('database') protected readonly database: string,
        @inject(SHARED_TYPES.User) protected readonly user: AuthUserDTO,
    ) {
        super(database, collection, user)
    }

}