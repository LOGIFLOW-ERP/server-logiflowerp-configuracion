import { DataVerifyEmailDTO } from '../Domain';
import { AdapterToken, MongoRepository, SHARED_TYPES } from '@Shared/Infrastructure';
import { BadRequestException, ForbiddenException } from '@Config/exception';
import { inject } from 'inversify';
import { AuthUserDTO, collections, State, UserENTITY } from 'logiflowerp-sdk';

export class UseCaseVerifyEmail {

    constructor(
        @inject(SHARED_TYPES.AdapterToken) private readonly adapterToken: AdapterToken,
    ) { }

    async exec(data: DataVerifyEmailDTO, tenant:string) {

        const payload = await this.adapterToken.verify(data.token)
        if (!payload) {
            throw new ForbiddenException('Token no válido o expirado')
        }

        const repository = new MongoRepository<UserENTITY>(tenant, collections.user, new AuthUserDTO())

        const pipeline = [{ $match: { _id: payload.user._id, state: State.ACTIVO, isDeleted: false } }]
        const user = await repository.selectOne(pipeline)

        if (user.emailVerified) {
            throw new BadRequestException('Email ya se verificó')
        }

        const filter = { _id: user._id }
        const update = { $set: { emailVerified: true } }
        await repository.updateOne(filter, update)
    }

}