import { ConflictException, ForbiddenException } from '@Config/exception'
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
        return { personnel }
    }

    private async searchPersonnel(identity: string) {
        const pipeline = [{ $match: { identity, state: State.ACTIVO, isDeleted: false } }]
        const result = await this.repository.select(pipeline)
        if (result.length > 1) {
            throw new ConflictException('Se encontró más de un personal')
        }
        if (result.length === 1) {
            return result[0]
        }
        return null
    }

}