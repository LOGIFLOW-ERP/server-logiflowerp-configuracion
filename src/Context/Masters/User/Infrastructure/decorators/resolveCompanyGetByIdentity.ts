import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { USER_TYPES } from '../IoC';
import { UseCaseGetByIdentity } from '../../Application';
import { UserMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyGetByIdentity = resolveCompanyDecorator(
    USER_TYPES.UseCaseGetByIdentity,
    UseCaseGetByIdentity,
    USER_TYPES.RepositoryMongo,
    UserMongoRepository,
    collection
)   