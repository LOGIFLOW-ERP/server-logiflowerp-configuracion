import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { PERSONNEL_TYPES } from '../IoC';
import { UseCaseInsertOne } from '../../Application';
import { PersonnelMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyInsertOne = resolveCompanyDecorator(
    PERSONNEL_TYPES.UseCaseInsertOne,
    UseCaseInsertOne,
    PERSONNEL_TYPES.RepositoryMongo,
    PersonnelMongoRepository,
    collection
)