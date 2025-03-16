import { ConflictException } from '@Config/exception'
import { IProfileMongoRepository } from '@Masters/Profile/Domain'
import { UserENTITY } from 'logiflowerp-sdk'

export class UseCaseGetProfile {

    constructor(
        private readonly repositoryProfile: IProfileMongoRepository,
    ) { }

    async exec(user: UserENTITY) {
        if (!user._idprofile) return
        const pipeline = [{ $match: { _id: user._idprofile } }]
        const profile = await this.repositoryProfile.select(pipeline)
        if (profile.length !== 1) {
            throw new ConflictException(`Error al buscar perfil. Hay ${profile.length} resultados para ${JSON.stringify(pipeline)}`)
        }
        return profile[0]
    }

}