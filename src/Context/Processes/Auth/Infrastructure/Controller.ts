import { inject } from 'inversify'
import { AUTH_TYPES } from './IoC'
import { Request, Response } from 'express'
import { BadRequestException as BRE } from '@Config'
import {
    BaseHttpController,
    httpPost,
    request,
    response
} from 'inversify-express-utils'
import {
    UseCaseRequestPasswordReset,
    UseCaseResetPassword,
    UseCaseSignIn,
    UseCaseSignUp,
    UseCaseVerifyEmail
} from '../Application'
import {
    CreateUserDTO,
    ResetPasswordDTO,
    ResponseSignIn,
    SignInDTO,
    validateRequestBody as VRB
} from 'logiflowerp-sdk'
import { AdapterRabbitMQ, SHARED_QUEUES, SHARED_TYPES } from '@Shared/Infrastructure'
import { DataRequestPasswordResetDTO, DataVerifyEmailDTO } from '../Domain'

export class AuthController extends BaseHttpController {

    constructor(
        @inject(AUTH_TYPES.UseCaseSignUp) private readonly useCaseSignUp: UseCaseSignUp,
        @inject(AUTH_TYPES.UseCaseSignIn) private readonly useCaseSignIn: UseCaseSignIn,
        @inject(AUTH_TYPES.UseCaseVerifyEmail) private readonly useCaseVerifyEmail: UseCaseVerifyEmail,
        @inject(SHARED_TYPES.AdapterRabbitMQ) private readonly adapterRabbitMQ: AdapterRabbitMQ,
        @inject(AUTH_TYPES.UseCaseRequestPasswordReset) private readonly useCaseRequestPasswordReset: UseCaseRequestPasswordReset,
        @inject(AUTH_TYPES.UseCaseResetPassword) private readonly useCaseResetPassword: UseCaseResetPassword,
    ) {
        super()
    }

    @httpPost('sign-up', VRB.bind(null, CreateUserDTO, BRE))
    async saveOne(@request() req: Request, @response() res: Response) {
        const newDoc = await this.useCaseSignUp.exec(req.body)
        await this.adapterRabbitMQ.publish({ queue: SHARED_QUEUES.MAIL_REGISTER_USER, message: newDoc })
        res.status(201).json(newDoc)
    }

    @httpPost('verify-email', VRB.bind(null, DataVerifyEmailDTO, BRE))
    async verifyEmail(@request() req: Request, @response() res: Response) {
        await this.useCaseVerifyEmail.exec(req.body)
        res.sendStatus(204)
    }

    @httpPost('request-password-reset', VRB.bind(null, DataRequestPasswordResetDTO, BRE))
    async requestPasswordReset(@request() req: Request, @response() res: Response) {
        await this.useCaseRequestPasswordReset.exec(req.body.email)
        res.sendStatus(204)
    }

    @httpPost('reset-password', VRB.bind(null, ResetPasswordDTO, BRE))
    async resetPassword(@request() req: Request, @response() res: Response) {
        await this.useCaseResetPassword.exec(req.body.token, req.body.password)
        res.sendStatus(204)
    }

    @httpPost('sign-in', VRB.bind(null, SignInDTO, BRE))
    async signIn(@request() req: Request, @response() res: Response) {
        const { token, user, dataSystemOptions } = await this.useCaseSignIn.exec(req.body)
        res.cookie(
            'authToken',
            token,
            {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            }
        )
        const response: ResponseSignIn = { user, dataSystemOptions }
        res.status(200).json(response)
    }

    @httpPost('sign-out')
    async signOut(@request() _req: Request, @response() res: Response) {
        res.clearCookie('authToken')
        res.sendStatus(204)
    }

}