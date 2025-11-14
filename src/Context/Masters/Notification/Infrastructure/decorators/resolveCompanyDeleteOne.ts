import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { NOTIFICATION_TYPES } from '../IoC';
import { UseCaseDeleteOne } from '../../Application';
import { NotificationMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyDeleteOne = resolveCompanyDecorator(
    NOTIFICATION_TYPES.UseCaseDeleteOne,
    UseCaseDeleteOne,
    NOTIFICATION_TYPES.RepositoryMongo,
    NotificationMongoRepository,
    collection
)