import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { CURRENCY_TYPES } from '../IoC';
import { UseCaseFind } from '../../Application';
import { CurrencyMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyFind = resolveCompanyDecorator(
    CURRENCY_TYPES.UseCaseFind,
    UseCaseFind,
    CURRENCY_TYPES.RepositoryMongo,
    CurrencyMongoRepository,
    collection
)