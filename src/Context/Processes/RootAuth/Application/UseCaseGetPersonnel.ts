import { ForbiddenException } from '@Config/exception'
import { State, UserENTITY } from 'logiflowerp-sdk'
import { IPersonnelMongoRepository } from '@Masters/Personnel/Domain'
import { inject, injectable } from 'inversify'
import { PERSONNEL_TYPES } from '@Masters/Personnel/Infrastructure/IoC'

@injectable()
export class UseCaseGetPersonnel {

    constructor(
        @inject(PERSONNEL_TYPES.RepositoryMongo) private readonly repository: IPersonnelMongoRepository,
    ) { }

    async exec(user: UserENTITY) {
        const personnel = await this.searchPersonnel(user.identity)
        if (personnel.state === State.INACTIVO) {
            throw new ForbiddenException('El personal está inactivo', true)
        }
        return { personnel }
    }

    private searchPersonnel(identity: string) {
        const pipeline = [{ $match: { identity } }]
        return this.repository.selectOne(pipeline)
    }

}