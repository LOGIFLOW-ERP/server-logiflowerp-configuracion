import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { USER_TYPES } from '../IoC';
import { UseCaseGetAll } from '../../Application';
import { UserMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyGetAll = resolveCompanyDecorator(
    USER_TYPES.UseCaseGetAll,
    UseCaseGetAll,
    USER_TYPES.RepositoryMongo,
    UserMongoRepository,
    collection
)