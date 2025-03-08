import { injectable } from 'inversify'
import { IRootCompanyMongoRepository } from '../Domain'
@injectable()
export class UseCaseDeleteOne {

    constructor(
        private readonly repository: IRootCompanyMongoRepository,
    ) { }

    async exec(_id: string) {
        return this.repository.deleteOne({ _id })
    }

}