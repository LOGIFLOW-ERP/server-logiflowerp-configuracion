import { ConflictException, NotFoundException } from '@Config/exception';
import { AdapterMail, AdapterToken } from '@Shared/Infrastructure';
import { TokenPayloadDTO, UserENTITY } from 'logiflowerp-sdk';
import path from 'path'
import fs from 'fs'
import { IRootUserMongoRepository } from '@Masters/RootUser/Domain';
import { inject } from 'inversify';
import { CONFIG_TYPES } from '@Config/types';

export class UseCaseRequestPasswordReset {

    constructor(
        private readonly repository: IRootUserMongoRepository,
        private readonly adapterToken: AdapterToken,
        private readonly adapterMail: AdapterMail,
        @inject(CONFIG_TYPES.Env) private readonly env: Env,
    ) { }

    async exec(email: string) {
        const user = await this.searchUser(email)
        const payload = this.generatePayloadToken(user)
        const token = await this.adapterToken.create(payload, undefined, 180)
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
            .replace('{{ENLACE_RESTABLECER_CONTRASEÑA}}', `${this.env.FRONTEND_URL}reset-password?token=${token}`)
            .replace('{{names}}', user.names)
        return html
    }

}
