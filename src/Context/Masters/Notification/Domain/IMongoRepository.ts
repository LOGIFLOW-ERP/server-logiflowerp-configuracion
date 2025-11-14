import { IMongoRepository } from '@Shared/Domain'
import { NotificationENTITY } from 'logiflowerp-sdk'

export interface INotificationMongoRepository extends IMongoRepository<NotificationENTITY> { }