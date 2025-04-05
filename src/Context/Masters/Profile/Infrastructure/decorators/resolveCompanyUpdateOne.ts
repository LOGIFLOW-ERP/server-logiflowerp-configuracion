import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { PROFILE_TYPES } from '../IoC';
import { UseCaseUpdateOne } from '../../Application';
import { ProfileMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyUpdateOne = resolveCompanyDecorator(
    PROFILE_TYPES.UseCaseUpdateOne,
    UseCaseUpdateOne,
    PROFILE_TYPES.RepositoryMongo,
    ProfileMongoRepository,
    collection
)