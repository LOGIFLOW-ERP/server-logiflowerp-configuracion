import { INotificationMongoRepository } from '../Domain'
import { UpdateNotificationDTO, validateCustom } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'
import { NOTIFICATION_TYPES } from '../Infrastructure/IoC'
import { UnprocessableEntityException } from '@Config/exception'

@injectable()
export class UseCaseUpdateOne {

    constructor(
        @inject(NOTIFICATION_TYPES.RepositoryMongo) private readonly repository: INotificationMongoRepository,
    ) { }

    async exec(_id: string, dto: UpdateNotificationDTO) {
        const _dto = await validateCustom(dto, UpdateNotificationDTO, UnprocessableEntityException)
        return this.repository.updateOne({ _id }, { $set: _dto })
    }
}