import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { PROFILE_TYPES } from '../IoC';
import { UseCaseInsertOne } from '../../Application';
import { ProfileMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyInsertOne = resolveCompanyDecorator(
    PROFILE_TYPES.UseCaseInsertOne,
    UseCaseInsertOne,
    PROFILE_TYPES.RepositoryMongo,
    ProfileMongoRepository,
    collection
)