import { injectable } from 'inversify'
import { ICompanyMongoRepository } from '../Domain'
@injectable()
export class UseCaseDeleteOne {

    constructor(
        private readonly repository: ICompanyMongoRepository,
    ) { }

    async exec(_id: string) {
        return this.repository.deleteOne({ _id })
    }

}