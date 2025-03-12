import { IProfileMongoRepository } from '../Domain'

export class UseCaseSave {

    constructor(
        private readonly repository: IProfileMongoRepository,
    ) { }

    async exec() {

    }

}