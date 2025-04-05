import { resolveCompanyUseCasesDecorator } from '@Shared/Infrastructure/decorators';
import { COMPANY_TYPES } from '../IoC';
import { CompanyMongoRepository } from '../MongoRepository';
import { collection } from '../config';
import { CreateCompanyDTO, CreateCompanyPERDTO } from 'logiflowerp-sdk';
import { UseCaseInsertOne, UseCaseInsertOnePER } from '../../Application';

const countryConfigs: CountryConfig = new Map([
    ['PER', { dto: CreateCompanyPERDTO, symbolUseCase: COMPANY_TYPES.UseCaseInsertOnePER, constructorUseCase: UseCaseInsertOnePER }],
    ['DEFAULT', { dto: CreateCompanyDTO, symbolUseCase: COMPANY_TYPES.UseCaseInsertOne, constructorUseCase: UseCaseInsertOne }],
])

export const resolveCompanyInsertOne = resolveCompanyUseCasesDecorator(
    countryConfigs,
    COMPANY_TYPES.RepositoryMongo,
    CompanyMongoRepository,
    collection
)