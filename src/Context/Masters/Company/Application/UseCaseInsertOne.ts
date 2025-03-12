import { ICompanyMongoRepository } from '../Domain';
import { CompanyENTITY, validateCustom, CreateCompanyDTO } from 'logiflowerp-sdk';
import { UnprocessableEntityException } from '@Config/exception';

export class UseCaseInsertOne {

    constructor(
        private readonly repository: ICompanyMongoRepository,
    ) { }

    async exec(dto: CreateCompanyDTO) {
        const _entity = new CompanyENTITY()
        _entity.set(dto)
        _entity._id = crypto.randomUUID()
        const entity = await validateCustom(_entity, CompanyENTITY, UnprocessableEntityException)
        return this.repository.insertOne(entity)
    }

}