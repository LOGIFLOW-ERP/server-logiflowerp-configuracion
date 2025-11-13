import { INotificationMongoRepository } from '../Domain';
import { CreateNotificationDTO, mapJsonToClass, NotificationENTITY, validateCustom } from 'logiflowerp-sdk';
import { UnprocessableEntityException } from '@Config/exception';
import { inject, injectable } from 'inversify'
import { NOTIFICATION_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseInsertOne {

    constructor(
        @inject(NOTIFICATION_TYPES.RepositoryMongo) private readonly repository: INotificationMongoRepository,
    ) { }

    async exec(dto: CreateNotificationDTO) {
        const _entity = mapJsonToClass(dto, NotificationENTITY)
        const entity = await validateCustom(_entity, NotificationENTITY, UnprocessableEntityException)
        return this.repository.insertOne(entity)
    }
}