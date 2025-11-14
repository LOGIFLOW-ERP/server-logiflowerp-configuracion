import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { NOTIFICATION_TYPES } from '../IoC';
import { UseCaseInsertOne } from '../../Application';
import { NotificationMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyInsertOne = resolveCompanyDecorator(
    NOTIFICATION_TYPES.UseCaseInsertOne,
    UseCaseInsertOne,
    NOTIFICATION_TYPES.RepositoryMongo,
    NotificationMongoRepository,
    collection
)