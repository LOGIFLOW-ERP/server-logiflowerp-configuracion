import { inject, injectable } from 'inversify'
import { ICompanyMongoRepository } from '../Domain'
import { COMPANY_TYPES } from '../Infrastructure/IoC'
import { ConflictException } from '@Config/exception'

@injectable()
export class UseCaseDeleteOne {

    constructor(
        @inject(COMPANY_TYPES.RepositoryMongo) private readonly repository: ICompanyMongoRepository,
    ) { }

    async exec(_id: string) {

        const entity = await this.repository.select([{ $match: { _id, isDeleted: false } }])

        if (entity.length !== 1) {
            throw new ConflictException(`¡Hay ${entity.length} resultado(s) para empresa con _id ${_id}!`, true)
        }

        return this.repository.deleteOne({ _id })
    }

}