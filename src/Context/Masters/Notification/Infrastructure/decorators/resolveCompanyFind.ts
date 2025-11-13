import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { NOTIFICATION_TYPES } from '../IoC';
import { UseCaseFind } from '../../Application';
import { NotificationMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyFind = resolveCompanyDecorator(
    NOTIFICATION_TYPES.UseCaseFind,
    UseCaseFind,
    NOTIFICATION_TYPES.RepositoryMongo,
    NotificationMongoRepository,
    collection
)