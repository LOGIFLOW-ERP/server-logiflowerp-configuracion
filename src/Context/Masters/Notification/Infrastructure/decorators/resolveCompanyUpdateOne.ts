import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { NOTIFICATION_TYPES } from '../IoC';
import { UseCaseUpdateOne } from '../../Application';
import { NotificationMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyUpdateOne = resolveCompanyDecorator(
    NOTIFICATION_TYPES.UseCaseUpdateOne,
    UseCaseUpdateOne,
    NOTIFICATION_TYPES.RepositoryMongo,
    NotificationMongoRepository,
    collection
)