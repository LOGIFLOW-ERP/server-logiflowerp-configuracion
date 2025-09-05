import { UnauthorizedException } from '@Config/exception'
import { ContainerGlobal } from '@Config/inversify'
import { AdapterToken, SHARED_TYPES } from '@Shared/Infrastructure'
import { Application } from 'express'

export function auth(app: Application, rootPath: string) {
    app.use(async (req, _res, next) => {
        try {
            let serviceNoAuth: boolean = true

            const publicRoutes = [
                `${rootPath}/processes/rootauth/sign-in`,
                `${rootPath}/processes/rootauth/sign-up`,
                `${rootPath}/processes/rootauth/sign-out`,
                `${rootPath}/processes/rootauth/verify-email`,
                `${rootPath}/processes/rootauth/request-password-reset`,
                `${rootPath}/processes/rootauth/reset-password`,
                `${rootPath}/processes/rootauth/resend-mail-register-user`,
                `${rootPath}/processes/rootauth/check-tenant`,
            ]

            const url = req.originalUrl.toLowerCase()

            if (publicRoutes.some(route => route.toLowerCase() === url)) {
                serviceNoAuth = false
            }

            if (!serviceNoAuth) return next()

            const token = req.cookies.authToken || req.headers['authorization']

            if (!token) {
                return next(new UnauthorizedException('No autorizado, token faltante'))
            }

            const adapterToken = ContainerGlobal.get<AdapterToken>(SHARED_TYPES.AdapterToken)
            const decoded = await adapterToken.verify(token)

            if (!decoded) {
                return next(new UnauthorizedException('Token inválido o expirado'))
            }

            req.payloadToken = decoded
            req.user = decoded.user
            req.rootCompany = decoded.rootCompany

            next()
        } catch (error) {
            next(error)
        }
    })
}
