import { IPersonnelMongoRepository } from '../Domain';
import { CreateEmployeeDTO, EmployeeENTITY, validateCustom } from 'logiflowerp-sdk';
import { UnprocessableEntityException } from '@Config/exception';

export class UseCaseInsertOne {

    constructor(
        private readonly repository: IPersonnelMongoRepository,
    ) { }

    async exec(dto: CreateEmployeeDTO) {
        const _entity = new EmployeeENTITY()
        _entity.set(dto)
        const entity = await validateCustom(_entity, EmployeeENTITY, UnprocessableEntityException)
        return this.repository.insertOne(entity)
    }

}