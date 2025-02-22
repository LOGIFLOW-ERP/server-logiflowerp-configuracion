import { inject, injectable } from 'inversify'
import { PROFILE_TYPES } from '../Infrastructure/IoC/types'
import { IProfileMongoRepository } from '../Domain'

@injectable()
export class UseCaseSave {

    constructor(
        @inject(PROFILE_TYPES.MongoRepository) private readonly repository: IProfileMongoRepository,
    ) { }

    async exec() {

    }

}