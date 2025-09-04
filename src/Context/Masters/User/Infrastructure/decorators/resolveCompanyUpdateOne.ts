import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { USER_TYPES } from '../IoC';
import { UseCaseUpdateOne } from '../../Application';
import { UserMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyUpdateOne = resolveCompanyDecorator(
    USER_TYPES.UseCaseUpdateOne,
    UseCaseUpdateOne,
    USER_TYPES.RepositoryMongo,
    UserMongoRepository,
    collection
)