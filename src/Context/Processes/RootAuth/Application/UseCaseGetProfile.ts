import { ConflictException } from '@Config/exception'
import { IProfileMongoRepository } from '@Masters/Profile/Domain'
import { PROFILE_TYPES } from '@Masters/Profile/Infrastructure/IoC'
import { inject, injectable } from 'inversify'
import { EmployeeENTITY, State } from 'logiflowerp-sdk'

@injectable()
export class UseCaseGetProfile {

    constructor(
        @inject(PROFILE_TYPES.RepositoryMongo) private readonly repository: IProfileMongoRepository,
    ) { }

    async exec(personnel: EmployeeENTITY) {
        const pipeline = [{ $match: { _id: personnel._idprofile, state: State.ACTIVO } }]
        const profile = await this.repository.select(pipeline)
        if (!profile.length) {
            throw new ConflictException(`Aún no tiene un perfil asignado`, true)
        }
        if (profile.length > 1) {
            throw new ConflictException(`Error al buscar perfil. Hay ${profile.length} resultados para ${JSON.stringify(pipeline)}`)
        }
        return { profile: profile[0] }
    }

}