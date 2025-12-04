import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { PERSONNEL_TYPES } from '../IoC';
import { UseCaseFindIndividual } from '../../Application';
import { PersonnelMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyFindIndividual = resolveCompanyDecorator(
    PERSONNEL_TYPES.UseCaseFindIndividual,
    UseCaseFindIndividual,
    PERSONNEL_TYPES.RepositoryMongo,
    PersonnelMongoRepository,
    collection
)