import { env } from '@Config'
import { injectable } from 'inversify'
import JWT from 'jsonwebtoken'

@injectable()
export class AdapterToken {

    verifyToken(token: string) {
        try {
            const key = env.JWT_KEY
            return JWT.verify(token, key)
        } catch (error) {
            return null
        }
    }

}