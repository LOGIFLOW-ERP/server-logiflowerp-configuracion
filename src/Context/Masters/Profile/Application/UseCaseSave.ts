import { injectable } from 'inversify'
import { IProfileMongoRepository } from '../Domain'

@injectable()
export class UseCaseSave {

    constructor(
        private readonly repository: IProfileMongoRepository,
    ) { }

    async exec() {

    }

}