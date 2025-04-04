import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { COMPANY_TYPES } from '../IoC';
import { UseCaseGetAll } from '../../Application';
import { CompanyMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyGetAll = resolveCompanyDecorator(
    COMPANY_TYPES.UseCaseGetAll,
    UseCaseGetAll,
    COMPANY_TYPES.RepositoryMongo,
    CompanyMongoRepository,
    collection
)