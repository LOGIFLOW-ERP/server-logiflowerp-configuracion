import { ConflictException, ForbiddenException, NotFoundException } from '@Config/exception';
import { IRootUserMongoRepository } from '@Masters/RootUser/Domain';
import { ROOT_USER_TYPES } from '@Masters/RootUser/Infrastructure/IoC';
import { inject, injectable } from 'inversify';
import { AuthUserDTO, ChangePasswordDTO, State } from 'logiflowerp-sdk';

@injectable()
export class UseCaseChangePassword {

    constructor(
        @inject(ROOT_USER_TYPES.RepositoryMongo) private readonly repository: IRootUserMongoRepository,
    ) { }

    async exec(userAuth: AuthUserDTO, data: ChangePasswordDTO) {

        const user = await this.searchUser(userAuth._id)

        if (user.password !== data.password) {
            throw new ForbiddenException('Contraseña actual inválida', true)
        }

        if (data.newPassword !== data.confirmNewPassword) {
            throw new ForbiddenException('Nueva contraseña y confirmación no coinciden', true)
        }

        if (user.password === data.newPassword) {
            throw new ForbiddenException('La nueva contraseña no puede ser igual a la anterior', true)
        }

        await this.repository.updateOne(
            { _id: user._id },
            { $set: { password: data.newPassword } }
        )

    }

    private async searchUser(_id: string) {
        const pipeline = [{ $match: { _id, state: State.ACTIVO } }]
        const data = await this.repository.select(pipeline)
        if (!data.length) {
            throw new NotFoundException('Usuario no encontrado')
        }
        if (data.length > 1) {
            throw new ConflictException(`Error al solicitar restablecer contraseña`)
        }
        return data[0]
    }

}