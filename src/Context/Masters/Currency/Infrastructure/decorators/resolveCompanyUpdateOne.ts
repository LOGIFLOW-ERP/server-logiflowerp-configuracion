import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { CURRENCY_TYPES } from '../IoC';
import { UseCaseUpdateOne } from '../../Application';
import { CurrencyMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyUpdateOne = resolveCompanyDecorator(
    CURRENCY_TYPES.UseCaseUpdateOne,
    UseCaseUpdateOne,
    CURRENCY_TYPES.RepositoryMongo,
    CurrencyMongoRepository,
    collection
)