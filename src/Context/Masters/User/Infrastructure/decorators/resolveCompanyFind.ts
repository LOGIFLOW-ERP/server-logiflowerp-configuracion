import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { USER_TYPES } from '../IoC';
import { UseCaseFind } from '../../Application';
import { UserMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyFind = resolveCompanyDecorator(
    USER_TYPES.UseCaseFind,
    UseCaseFind,
    USER_TYPES.RepositoryMongo,
    UserMongoRepository,
    collection
)