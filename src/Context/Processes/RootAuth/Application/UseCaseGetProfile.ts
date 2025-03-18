import { ConflictException } from '@Config/exception'
import { IProfileMongoRepository } from '@Masters/Profile/Domain'
import { EmployeeENTITY } from 'logiflowerp-sdk'

export class UseCaseGetProfile {

    constructor(
        private readonly repositoryProfile: IProfileMongoRepository,
    ) { }

    async exec(personnel: EmployeeENTITY) {
        const pipeline = [{ $match: { _id: personnel._idprofile } }]
        const profile = await this.repositoryProfile.select(pipeline)
        if (!profile.length) {
            throw new ConflictException(`Aún no tiene un perfil asignado`, true)
        }
        if (profile.length > 1) {
            throw new ConflictException(`Error al buscar perfil. Hay ${profile.length} resultados para ${JSON.stringify(pipeline)}`)
        }
        return { profile: profile[0] }
    }

}