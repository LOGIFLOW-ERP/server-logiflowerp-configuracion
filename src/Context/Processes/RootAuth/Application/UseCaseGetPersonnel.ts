import { ConflictException, ForbiddenException, UnauthorizedException } from '@Config/exception'
import { UserENTITY } from 'logiflowerp-sdk'
import { IPersonnelMongoRepository } from '@Masters/Personnel/Domain'

export class UseCaseGetPersonnel {

    constructor(
        private readonly repository: IPersonnelMongoRepository,
    ) { }

    async exec(user: UserENTITY) {
        const personnel = await this.searchPersonnel(user.identity)
        if (!personnel.state) {
            throw new ForbiddenException('El personal está inactivo', true)
        }
        return { personnel }
    }

    private async searchPersonnel(identity: string) {
        const pipeline = [{ $match: { identity } }]
        const data = await this.repository.select(pipeline)
        if (!data.length) {
            throw new UnauthorizedException('Usted no es personal de esta empresa', true)
        }
        if (data.length > 1) {
            throw new ConflictException(`Hay mas de un resultado para personal con identificación ${identity}`)
        }
        return data[0]
    }

}