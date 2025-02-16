import { env, UnprocessableEntityException } from '@Config'
import { injectable } from 'inversify'
import JWT from 'jsonwebtoken'
import { TokenPayloadDTO, validateCustom } from 'logiflowerp-sdk'

@injectable()
export class AdapterToken {

    create(payload: TokenPayloadDTO, secretOrPrivateKey: string = env.JWT_KEY, expiresIn?: number) {
        return JWT.sign(payload, secretOrPrivateKey, expiresIn ? { expiresIn } : {})
    }

    async verify(token: string, secretOrPublicKey: string = env.JWT_KEY) {
        try {
            const res = JWT.verify(token, secretOrPublicKey) as TokenPayloadDTO
            return validateCustom(res, TokenPayloadDTO, UnprocessableEntityException)
        } catch (error) {
            return null
        }
    }

}