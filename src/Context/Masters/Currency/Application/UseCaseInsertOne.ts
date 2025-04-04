import { ICurrencyMongoRepository } from '../Domain';
import { CreateCurrencyDTO, CurrencyENTITY, validateCustom } from 'logiflowerp-sdk';
import { UnprocessableEntityException } from '@Config/exception';
import { inject, injectable } from 'inversify'
import { CURRENCY_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseInsertOne {

    constructor(
        @inject(CURRENCY_TYPES.RepositoryMongo) private readonly repository: ICurrencyMongoRepository,
    ) { }

    async exec(dto: CreateCurrencyDTO) {
        const _entity = new CurrencyENTITY()
        _entity.set(dto)
        const entity = await validateCustom(_entity, CurrencyENTITY, UnprocessableEntityException)
        return this.repository.insertOne(entity)
    }

}