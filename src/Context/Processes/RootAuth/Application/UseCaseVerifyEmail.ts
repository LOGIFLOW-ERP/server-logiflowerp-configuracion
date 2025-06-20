import { IRootUserMongoRepository } from '@Masters/RootUser/Domain';
import { DataVerifyEmailDTO } from '../Domain';
import { AdapterToken, SHARED_TYPES } from '@Shared/Infrastructure';
import { BadRequestException, ForbiddenException } from '@Config/exception';
import { ROOT_USER_TYPES } from '@Masters/RootUser/Infrastructure/IoC';
import { inject } from 'inversify';
import { State } from 'logiflowerp-sdk';

export class UseCaseVerifyEmail {

    constructor(
        @inject(ROOT_USER_TYPES.RepositoryMongo) private readonly repository: IRootUserMongoRepository,
        @inject(SHARED_TYPES.AdapterToken) private readonly adapterToken: AdapterToken,
    ) { }

    async exec(data: DataVerifyEmailDTO) {

        const payload = await this.adapterToken.verify(data.token)
        if (!payload) {
            throw new ForbiddenException('Token no válido o expirado')
        }

        const pipeline = [{ $match: { _id: payload.user._id, state: State.ACTIVO, isDeleted: false } }]
        const user = await this.repository.selectOne(pipeline)

        if (user.emailVerified) {
            throw new BadRequestException('Email ya se verificó')
        }

        const filter = { _id: user._id }
        const update = { $set: { emailVerified: true } }
        await this.repository.updateOne(filter, update)
    }

}