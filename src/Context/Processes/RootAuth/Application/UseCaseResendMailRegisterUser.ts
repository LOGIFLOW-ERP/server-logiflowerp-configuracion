import { ConflictException } from '@Config/exception';
import { injectable } from 'inversify';
import { DataRequestResendMailRegisterUser } from '../Domain';
import { MongoRepository } from '@Shared/Infrastructure';
import { AuthUserDTO, collections, UserENTITY } from 'logiflowerp-sdk';

@injectable()
export class UseCaseResendMailRegisterUser {
    async exec(data: DataRequestResendMailRegisterUser, tenant: string) {
        const repository = new MongoRepository<UserENTITY>(tenant, collections.user, new AuthUserDTO())
        const user = await repository.selectOne([{ $match: { email: data.email, isDeleted: false } }])
        if (user.emailVerified) {
            throw new ConflictException('El correo ya ha sido verificado')
        }
        return user
    }
}