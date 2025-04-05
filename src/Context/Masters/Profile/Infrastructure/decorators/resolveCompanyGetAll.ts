import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { PROFILE_TYPES } from '../IoC';
import { UseCaseGetAll } from '../../Application';
import { ProfileMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyGetAll = resolveCompanyDecorator(
    PROFILE_TYPES.UseCaseGetAll,
    UseCaseGetAll,
    PROFILE_TYPES.RepositoryMongo,
    ProfileMongoRepository,
    collection
)