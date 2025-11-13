import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { NOTIFICATION_TYPES } from '../IoC';
import { UseCaseGetAll } from '../../Application';
import { NotificationMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyGetAll = resolveCompanyDecorator(
    NOTIFICATION_TYPES.UseCaseGetAll,
    UseCaseGetAll,
    NOTIFICATION_TYPES.RepositoryMongo,
    NotificationMongoRepository,
    collection
)