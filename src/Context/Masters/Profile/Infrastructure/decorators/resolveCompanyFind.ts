import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { PROFILE_TYPES } from '../IoC';
import { UseCaseFind } from '../../Application';
import { ProfileMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyFind = resolveCompanyDecorator(
    PROFILE_TYPES.UseCaseFind,
    UseCaseFind,
    PROFILE_TYPES.RepositoryMongo,
    ProfileMongoRepository,
    collection
)