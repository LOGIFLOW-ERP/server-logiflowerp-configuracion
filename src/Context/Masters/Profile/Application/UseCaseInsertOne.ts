import { IProfileMongoRepository } from '../Domain';
import { CreateProfileDTO, ProfileENTITY, validateCustom } from 'logiflowerp-sdk';
import { UnprocessableEntityException } from '@Config/exception';

export class UseCaseInsertOne {

    constructor(
        private readonly repository: IProfileMongoRepository,
    ) { }

    async exec(dto: CreateProfileDTO) {
        const _entity = new ProfileENTITY()
        _entity.set(dto)
        const entity = await validateCustom(_entity, ProfileENTITY, UnprocessableEntityException)
        return this.repository.insertOne(entity)
    }

}