import { ConflictException, env, NotFoundException } from '@Config';
import { IUserMongoRepository } from '@Masters/User/Domain';
import { USER_TYPES } from '@Masters/User/Infrastructure';
import { AdapterMail, AdapterToken, SHARED_TYPES } from '@Shared/Infrastructure';
import { inject, injectable } from 'inversify'
import { TokenPayloadDTO, UserENTITY } from 'logiflowerp-sdk';
import path from 'path'
import fs from 'fs'

@injectable()
export class UseCaseRequestPasswordReset {

    constructor(
        @inject(USER_TYPES.MongoRepository) private readonly repository: IUserMongoRepository,
        @inject(SHARED_TYPES.AdapterToken) private readonly adapterToken: AdapterToken,
        @inject(SHARED_TYPES.AdapterMail) private readonly adapterMail: AdapterMail,
    ) { }

    async exec(email: string) {
        const user = await this.searchUser(email)
        const payload = this.generatePayloadToken(user)
        const token = await this.adapterToken.create(payload, undefined, 300)
        const HTMLMessage = this.prepareHTMLmessage(token, user)
        const subject = `Recuperación de contraseña`
        await this.adapterMail.send(user.email, subject, undefined, HTMLMessage)
    }

    private generatePayloadToken(entity: UserENTITY) {
        const payload = new TokenPayloadDTO()
        payload.user.set(entity)
        return payload
    }

    private async searchUser(email: string) {
        const pipeline = [{ $match: { email } }]
        const data = await this.repository.select(pipeline)
        if (!data.length) {
            throw new NotFoundException('Usuario no encontrado')
        }
        if (data.length > 1) {
            throw new ConflictException(`Error al solicitar restablecer contraseña`)
        }
        return data[0]
    }

    private prepareHTMLmessage(token: string, user: UserENTITY) {
        const filePath = path.join(__dirname, '../../../../../public/RequestPasswordReset.html')
        const html = fs.readFileSync(filePath, 'utf-8')
            .replace('{{ENLACE_RESTABLECER_CONTRASEÑA}}', `${env.FRONTEND_URL}reset-password?token=${token}`)
            .replace('{{names}}', user.names)
        return html
    }

}
