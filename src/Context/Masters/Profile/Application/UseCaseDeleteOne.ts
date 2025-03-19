import { IProfileMongoRepository } from '../Domain'

export class UseCaseDeleteOne {

    constructor(
        private readonly repository: IProfileMongoRepository,
    ) { }

    async exec(_id: string) {
        return this.repository.deleteOne({ _id })
    }

}