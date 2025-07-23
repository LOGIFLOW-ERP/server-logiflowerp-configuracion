import { ConflictException } from '@Config/exception';
import { IRootUserMongoRepository } from '@Masters/User/Domain';
import { ROOT_USER_TYPES } from '@Masters/User/Infrastructure/IoC';
import { inject, injectable } from 'inversify';
import { DataRequestResendMailRegisterUser } from '../Domain';

@injectable()
export class UseCaseResendMailRegisterUser {
    constructor(
        @inject(ROOT_USER_TYPES.RepositoryMongo) private readonly repository: IRootUserMongoRepository,
    ) { }

    async exec(data: DataRequestResendMailRegisterUser) {
        const user = await this.repository.selectOne([{ $match: { email: data.email, isDeleted: false } }])
        if (user.emailVerified) {
            throw new ConflictException('El correo ya ha sido verificado')
        }
        return user
    }
}