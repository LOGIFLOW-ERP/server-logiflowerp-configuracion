import { injectable } from 'inversify';
import { ICurrencyMongoRepository } from '../Domain';
import { CreateCurrencyDTO, CurrencyENTITY, validateCustom } from 'logiflowerp-sdk';
import { UnprocessableEntityException } from '@Config/exception';

@injectable()
export class UseCaseInsertOne {

    constructor(
        private readonly repository: ICurrencyMongoRepository,
    ) { }

    async exec(dto: CreateCurrencyDTO) {
        const _entity = new CurrencyENTITY()
        _entity.set(dto)
        const entity = await validateCustom(_entity, CurrencyENTITY, UnprocessableEntityException)
        return this.repository.insertOne(entity)
    }

}