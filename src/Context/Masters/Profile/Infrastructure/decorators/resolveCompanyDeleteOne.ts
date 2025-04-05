import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { PROFILE_TYPES } from '../IoC';
import { UseCaseDeleteOne } from '../../Application';
import { ProfileMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyDeleteOne = resolveCompanyDecorator(
    PROFILE_TYPES.UseCaseDeleteOne,
    UseCaseDeleteOne,
    PROFILE_TYPES.RepositoryMongo,
    ProfileMongoRepository,
    collection
)