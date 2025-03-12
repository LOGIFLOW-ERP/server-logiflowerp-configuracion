import { IRootCompanyMongoRepository } from '../Domain';
import { CreateRootCompanyDTO, RootCompanyENTITY, validateCustom } from 'logiflowerp-sdk';
import { UnprocessableEntityException } from '@Config/exception';

export class UseCaseInsertOne {

    constructor(
        private readonly repository: IRootCompanyMongoRepository
    ) { }

    async exec(dto: CreateRootCompanyDTO) {
        const _entity = new RootCompanyENTITY()
        _entity.set(dto)
        _entity._id = crypto.randomUUID()
        const entity = await validateCustom(_entity, RootCompanyENTITY, UnprocessableEntityException)
        return this.repository.insertOne(entity)
    }

}