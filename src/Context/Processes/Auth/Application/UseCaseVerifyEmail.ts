import { IRootUserMongoRepository } from '@Masters/RootUser/Domain';
import { DataVerifyEmailDTO } from '../Domain';
import { AdapterToken } from '@Shared/Infrastructure';
import { BadRequestException, ConflictException, UnauthorizedException } from '@Config/exception';

export class UseCaseVerifyEmail {

    constructor(
        private readonly repository: IRootUserMongoRepository,
        private readonly adapterToken: AdapterToken,
    ) { }

    async exec(data: DataVerifyEmailDTO) {

        const payload = await this.adapterToken.verify(data.token)
        if (!payload) {
            throw new UnauthorizedException('Token no válido o expirado')
        }

        const pipeline = [{ $match: { _id: payload.user._id } }]
        const user = await this.repository.select(pipeline)
        if (user.length !== 1) {
            throw new ConflictException(`Error al verificar email`)
        }
        if (user[0].emailVerified) {
            throw new BadRequestException('Email ya se verificó')
        }

        const filter = { _id: user[0]._id }
        const update = { $set: { emailVerified: true } }
        await this.repository.updateOne(filter, update)
    }

}