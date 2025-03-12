import { inject } from 'inversify'
import { Request, Response } from 'express'
import { BadRequestException as BRE } from '@Config/exception'
import {
    BaseHttpController,
    httpPost,
    request,
    response
} from 'inversify-express-utils'
import {
    UseCaseGetProfile,
    UseCaseGetRootSystemOption,
    UseCaseGetToken,
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
import { AdapterApiRequest, AdapterMail, AdapterRabbitMQ, AdapterToken, SHARED_QUEUES, SHARED_TYPES } from '@Shared/Infrastructure'
import { DataRequestPasswordResetDTO, DataVerifyEmailDTO } from '../Domain'
import { RootUserMongoRepository } from '@Masters/RootUser/Infrastructure/MongoRepository'
import { ProfileMongoRepository } from '@Masters/Profile/Infrastructure/MongoRepository'
import { RootSystemOptionMongoRepository } from '@Masters/RootSystemOption/Infrastructure/MongoRepository'

export class AuthController extends BaseHttpController {

    private readonly rootUserRepository = new RootUserMongoRepository(this.prefix_col_root)

    constructor(
        @inject(SHARED_TYPES.AdapterRabbitMQ) private readonly adapterRabbitMQ: AdapterRabbitMQ,
        @inject(SHARED_TYPES.AdapterToken) private readonly adapterToken: AdapterToken,
        @inject(SHARED_TYPES.AdapterMail) private readonly adapterMail: AdapterMail,
        @inject(SHARED_TYPES.AdapterApiRequest) private readonly adapterApiRequest: AdapterApiRequest,
        @inject(SHARED_TYPES.prefix_col_root) private readonly prefix_col_root: string,
    ) {
        super()
    }

    @httpPost('sign-up', VRB.bind(null, CreateUserDTO, BRE))
    async saveOne(@request() req: Request, @response() res: Response) {
        const newDoc = await new UseCaseSignUp(this.rootUserRepository, this.adapterApiRequest).exec(req.body)
        await this.adapterRabbitMQ.publish({ queue: SHARED_QUEUES.MAIL_REGISTER_USER, message: newDoc })
        res.status(201).json(newDoc)
    }

    @httpPost('verify-email', VRB.bind(null, DataVerifyEmailDTO, BRE))
    async verifyEmail(@request() req: Request, @response() res: Response) {
        await new UseCaseVerifyEmail(this.rootUserRepository, this.adapterToken).exec(req.body)
        res.sendStatus(204)
    }

    @httpPost('request-password-reset', VRB.bind(null, DataRequestPasswordResetDTO, BRE))
    async requestPasswordReset(@request() req: Request, @response() res: Response) {
        await new UseCaseRequestPasswordReset(this.rootUserRepository, this.adapterToken, this.adapterMail).exec(req.body.email)
        res.sendStatus(204)
    }

    @httpPost('reset-password', VRB.bind(null, ResetPasswordDTO, BRE))
    async resetPassword(@request() req: Request, @response() res: Response) {
        await new UseCaseResetPassword(this.rootUserRepository, this.adapterToken).exec(req.body.token, req.body.password)
        res.sendStatus(204)
    }

    @httpPost('sign-in', VRB.bind(null, SignInDTO, BRE))
    async signIn(@request() req: Request, @response() res: Response) {
        const { user, root } = await new UseCaseSignIn(this.rootUserRepository).exec(req.body)
        const profileRepository = new ProfileMongoRepository(user.company.code)
        const profile = await new UseCaseGetProfile(profileRepository).exec(user)
        const rootSystemOptionRepository = new RootSystemOptionMongoRepository(this.prefix_col_root)
        const { dataSystemOptions, routes } = await new UseCaseGetRootSystemOption(rootSystemOptionRepository).exec(root, profile)
        const { token, user: userResponse } = await new UseCaseGetToken(this.adapterToken).exec(user, root, routes, profile)
        res.cookie(
            'authToken',
            token,
            {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            }
        )
        const response: ResponseSignIn = { user: userResponse, dataSystemOptions, root }
        res.status(200).json(response)
    }

    @httpPost('sign-out')
    async signOut(@request() _req: Request, @response() res: Response) {
        res.clearCookie('authToken')
        res.sendStatus(204)
    }

}