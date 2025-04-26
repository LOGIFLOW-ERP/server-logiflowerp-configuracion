import { IProfileMongoRepository } from '@Masters/Profile/Domain'
import { PROFILE_TYPES } from '@Masters/Profile/Infrastructure/IoC'
import { inject, injectable } from 'inversify'
import { EmployeeENTITY, State } from 'logiflowerp-sdk'

@injectable()
export class UseCaseGetProfile {

    constructor(
        @inject(PROFILE_TYPES.RepositoryMongo) private readonly repository: IProfileMongoRepository,
    ) { }

    exec(personnel: EmployeeENTITY) {
        const pipeline = [{ $match: { _id: personnel._idprofile, state: State.ACTIVO } }]
        return this.repository.selectOne(pipeline)
    }

}