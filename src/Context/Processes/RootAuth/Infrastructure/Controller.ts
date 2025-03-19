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
    UseCaseGetPersonnel,
    UseCaseGetProfile,
    UseCaseGetRootCompany,
    UseCaseGetRootSystemOption,
    UseCaseGetRootSystemOptionRoot,
    UseCaseGetToken,
    UseCaseRequestPasswordReset,
    UseCaseResetPassword,
    UseCaseSignIn,
    UseCaseSignInRoot,
    UseCaseSignUp,
    UseCaseVerifyEmail
} from '../Application'
import {
    CreateUserDTO,
    ProfileENTITY,
    ResetPasswordDTO,
    ResponseSignIn,
    SignInDTO,
    SignInRootDTO,
    SystemOptionENTITY,
    validateRequestBody as VRB
} from 'logiflowerp-sdk'
import { AdapterApiRequest, AdapterMail, AdapterRabbitMQ, AdapterToken, SHARED_QUEUES, SHARED_TYPES } from '@Shared/Infrastructure'
import { DataRequestPasswordResetDTO, DataVerifyEmailDTO } from '../Domain'
import { RootUserMongoRepository } from '@Masters/RootUser/Infrastructure/MongoRepository'
import { ProfileMongoRepository } from '@Masters/Profile/Infrastructure/MongoRepository'
import { RootSystemOptionMongoRepository } from '@Masters/RootSystemOption/Infrastructure/MongoRepository'
import { RootCompanyMongoRepository } from '@Masters/RootCompany/Infrastructure/MongoRepository'
import { PersonnelMongoRepository } from '@Masters/Personnel/Infrastructure/MongoRepository'

export class RootAuthController extends BaseHttpController {

    private readonly rootUserRepository = new RootUserMongoRepository(this.prefix_col_root)
    private readonly rootCompanyRepository = new RootCompanyMongoRepository(this.prefix_col_root)
    private readonly rootSystemOptionRepository = new RootSystemOptionMongoRepository(this.prefix_col_root)

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
    async saveOne(@request() req: Request<{}, {}, CreateUserDTO>, @response() res: Response) {
        const newDoc = await new UseCaseSignUp(this.rootUserRepository, this.adapterApiRequest).exec(req.body)
        await this.adapterRabbitMQ.publish({ queue: SHARED_QUEUES.MAIL_REGISTER_USER, message: newDoc })
        res.status(201).json(newDoc)
    }

    @httpPost('verify-email', VRB.bind(null, DataVerifyEmailDTO, BRE))
    async verifyEmail(@request() req: Request<{}, {}, DataVerifyEmailDTO>, @response() res: Response) {
        await new UseCaseVerifyEmail(this.rootUserRepository, this.adapterToken).exec(req.body)
        res.sendStatus(204)
    }

    @httpPost('request-password-reset', VRB.bind(null, DataRequestPasswordResetDTO, BRE))
    async requestPasswordReset(@request() req: Request<{}, {}, DataRequestPasswordResetDTO>, @response() res: Response) {
        await new UseCaseRequestPasswordReset(this.rootUserRepository, this.adapterToken, this.adapterMail).exec(req.body.email)
        res.sendStatus(204)
    }

    @httpPost('reset-password', VRB.bind(null, ResetPasswordDTO, BRE))
    async resetPassword(@request() req: Request<{}, {}, ResetPasswordDTO>, @response() res: Response) {
        await new UseCaseResetPassword(this.rootUserRepository, this.adapterToken).exec(req.body.token, req.body.password)
        res.sendStatus(204)
    }

    @httpPost('sign-in-root', VRB.bind(null, SignInRootDTO, BRE))
    async signInRoot(@request() req: Request<{}, {}, SignInRootDTO>, @response() res: Response) {
        const { user } = await new UseCaseSignInRoot(this.rootUserRepository).exec(req.body)
        const rootSystemOptionRepository = new RootSystemOptionMongoRepository(this.prefix_col_root)
        const { dataSystemOptions, routes } = await new UseCaseGetRootSystemOptionRoot(rootSystemOptionRepository).exec()
        const { token, user: userResponse } = await new UseCaseGetToken(this.adapterToken).exec(user, true, routes)
        res.cookie(
            'authToken',
            token,
            {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            }
        )
        const response: ResponseSignIn = { user: userResponse, dataSystemOptions, root: true }
        res.status(200).json(response)
    }

    @httpPost('sign-in', VRB.bind(null, SignInDTO, BRE))
    async signIn(@request() req: Request<{}, {}, SignInDTO>, @response() res: Response) {
        const { user } = await new UseCaseSignIn(this.rootUserRepository).exec(req.body)
        const { rootCompany, isRoot } = await new UseCaseGetRootCompany(this.rootCompanyRepository).exec(user, req.body)
        let dataSystemOptions: SystemOptionENTITY[]
        let routes: string[]
        let profile: ProfileENTITY | undefined
        if (!isRoot) {
            const personnelRepository = new PersonnelMongoRepository(req.body.companyCode)
            const { personnel } = await new UseCaseGetPersonnel(personnelRepository).exec(user)
            const profileRepository = new ProfileMongoRepository(req.body.companyCode)
            const { profile: profileAux } = await new UseCaseGetProfile(profileRepository).exec(personnel)
            const { systemOptions, routesAux } = await new UseCaseGetRootSystemOption(this.rootSystemOptionRepository).exec(profileAux)
            dataSystemOptions = systemOptions
            routes = routesAux
            profile = profileAux
        } else {
            const { systemOptions, routesAux } = await new UseCaseGetRootSystemOption(this.rootSystemOptionRepository).execRoot(rootCompany)
            dataSystemOptions = systemOptions
            routes = routesAux
        }
        const { token, user: userResponse } = await new UseCaseGetToken(this.adapterToken).exec(user, false, routes, profile, rootCompany)
        res.cookie(
            'authToken',
            token,
            {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            }
        )
        const response: ResponseSignIn = { user: userResponse, dataSystemOptions, root: false }
        res.status(200).json(response)
    }

    @httpPost('sign-out')
    async signOut(@request() _req: Request, @response() res: Response) {
        res.clearCookie('authToken')
        res.sendStatus(204)
    }

}