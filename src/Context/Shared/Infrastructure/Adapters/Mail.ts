import { env } from '@Config'
import { injectable } from 'inversify'
import { createTransport, Transporter, } from 'nodemailer'

@injectable()
export class AdapterMail {

    private transporter: Transporter

    constructor() {
        this.transporter = this.createTransporter()
    }

    private createTransporter() {
        return createTransport({
            host: env.SMTP_HOST,
            port: env.PORT,
            auth: {
                user: env.EMAIL_USER,
                pass: env.EMAIL_PASS
            }
        })
    }

    async send(
        recipients: string | string[],
        subject: string,
        plaintextMessage: string | Buffer<ArrayBufferLike> | undefined,
        HTMLMessage: string | Buffer<ArrayBufferLike> | undefined
    ) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Nombre del Remitente" <Logiflow ERP>`,
                to: recipients,
                subject,
                text: plaintextMessage,
                html: HTMLMessage
            })
            console.log('Message sent: %s', info.messageId)
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error)
            throw error
        }
    }

}