import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { COMPANY_TYPES } from '../IoC';
import { UseCaseFind } from '../../Application';
import { CompanyMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyFind = resolveCompanyDecorator(
    COMPANY_TYPES.UseCaseFind,
    UseCaseFind,
    COMPANY_TYPES.RepositoryMongo,
    CompanyMongoRepository,
    collection
)