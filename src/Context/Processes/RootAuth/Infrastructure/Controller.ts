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
    collections,
    CreateUserDTO,
    ProfileENTITY,
    ResetPasswordDTO,
    ResponseSignIn,
    SignInDTO,
    SignInRootDTO,
    SystemOptionENTITY,
    validateRequestBody as VRB
} from 'logiflowerp-sdk'
import { AdapterRabbitMQ, createTenantScopedContainer, SHARED_QUEUES, SHARED_TYPES } from '@Shared/Infrastructure'
import { DataRequestPasswordResetDTO, DataVerifyEmailDTO } from '../Domain'
import { ProfileMongoRepository } from '@Masters/Profile/Infrastructure/MongoRepository'
import { PersonnelMongoRepository } from '@Masters/Personnel/Infrastructure/MongoRepository'
import { AUTH_TYPES } from './IoC'
import { PERSONNEL_TYPES } from '@Masters/Personnel/Infrastructure/IoC'
import { PROFILE_TYPES } from '@Masters/Profile/Infrastructure/IoC'

export class RootAuthController extends BaseHttpController {


    constructor(
        @inject(SHARED_TYPES.AdapterRabbitMQ) private readonly adapterRabbitMQ: AdapterRabbitMQ,
        @inject(AUTH_TYPES.UseCaseSignUp) private readonly useCaseSignUp: UseCaseSignUp,
        @inject(AUTH_TYPES.UseCaseVerifyEmail) private readonly useCaseVerifyEmail: UseCaseVerifyEmail,
        @inject(AUTH_TYPES.UseCaseRequestPasswordReset) private readonly useCaseRequestPasswordReset: UseCaseRequestPasswordReset,
        @inject(AUTH_TYPES.UseCaseResetPassword) private readonly useCaseResetPassword: UseCaseResetPassword,
        @inject(AUTH_TYPES.UseCaseSignInRoot) private readonly useCaseSignInRoot: UseCaseSignInRoot,
        @inject(AUTH_TYPES.UseCaseGetRootSystemOptionRoot) private readonly useCaseGetRootSystemOptionRoot: UseCaseGetRootSystemOptionRoot,
        @inject(AUTH_TYPES.UseCaseGetToken) private readonly useCaseGetToken: UseCaseGetToken,
        @inject(AUTH_TYPES.UseCaseSignIn) private readonly useCaseSignIn: UseCaseSignIn,
        @inject(AUTH_TYPES.UseCaseGetRootCompany) private readonly useCaseGetRootCompany: UseCaseGetRootCompany,
        @inject(AUTH_TYPES.UseCaseGetRootSystemOption) private readonly useCaseGetRootSystemOption: UseCaseGetRootSystemOption,
    ) {
        super()
    }

    @httpPost('sign-up', VRB.bind(null, CreateUserDTO, BRE))
    async saveOne(@request() req: Request<{}, {}, CreateUserDTO>, @response() res: Response) {
        const newDoc = await this.useCaseSignUp.exec(req.body)
        await this.adapterRabbitMQ.publish({ queue: SHARED_QUEUES.MAIL_REGISTER_USER, message: newDoc })
        res.status(201).json(newDoc)
    }

    @httpPost('verify-email', VRB.bind(null, DataVerifyEmailDTO, BRE))
    async verifyEmail(@request() req: Request<{}, {}, DataVerifyEmailDTO>, @response() res: Response) {
        await this.useCaseVerifyEmail.exec(req.body)
        res.sendStatus(204)
    }

    @httpPost('request-password-reset', VRB.bind(null, DataRequestPasswordResetDTO, BRE))
    async requestPasswordReset(@request() req: Request<{}, {}, DataRequestPasswordResetDTO>, @response() res: Response) {
        await this.useCaseRequestPasswordReset.exec(req.body.email)
        res.sendStatus(204)
    }

    @httpPost('reset-password', VRB.bind(null, ResetPasswordDTO, BRE))
    async resetPassword(@request() req: Request<{}, {}, ResetPasswordDTO>, @response() res: Response) {
        await this.useCaseResetPassword.exec(req.body.token, req.body.password)
        res.sendStatus(204)
    }

    @httpPost('sign-in-root', VRB.bind(null, SignInRootDTO, BRE))
    async signInRoot(@request() req: Request<{}, {}, SignInRootDTO>, @response() res: Response) {
        const { user } = await this.useCaseSignInRoot.exec(req.body)
        const { dataSystemOptions, routes } = await this.useCaseGetRootSystemOptionRoot.exec()
        const { token, user: userResponse } = await this.useCaseGetToken.exec(user, true, routes)
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
        const { user } = await this.useCaseSignIn.exec(req.body)
        const { rootCompany, isRoot } = await this.useCaseGetRootCompany.exec(user, req.body)
        let dataSystemOptions: SystemOptionENTITY[]
        let routes: string[]
        let profile: ProfileENTITY | undefined
        if (!isRoot) {
            const tenantContainerGetPersonnel = createTenantScopedContainer(
                AUTH_TYPES.UseCaseGetPersonnel,
                PERSONNEL_TYPES.RepositoryMongo,
                UseCaseGetPersonnel,
                PersonnelMongoRepository,
                req.body.companyCode,
                collections.personnel
            )
            const useCaseGetPersonnel = tenantContainerGetPersonnel.get<UseCaseGetPersonnel>(AUTH_TYPES.UseCaseGetPersonnel)
            const { personnel } = await useCaseGetPersonnel.exec(user)

            const tenantContainerGetProfile = createTenantScopedContainer(
                AUTH_TYPES.UseCaseGetProfile,
                PROFILE_TYPES.RepositoryMongo,
                UseCaseGetProfile,
                ProfileMongoRepository,
                req.body.companyCode,
                collections.profiles
            )
            const useCaseGetProfile = tenantContainerGetProfile.get<UseCaseGetProfile>(AUTH_TYPES.UseCaseGetProfile)
            const { profile: profileAux } = await useCaseGetProfile.exec(personnel)
            const { systemOptions, routesAux } = await this.useCaseGetRootSystemOption.exec(profileAux)
            dataSystemOptions = systemOptions
            routes = routesAux
            profile = profileAux
        } else {
            const { systemOptions, routesAux } = await this.useCaseGetRootSystemOption.execRoot(rootCompany)
            dataSystemOptions = systemOptions
            routes = routesAux
        }
        const { token, user: userResponse } = await this.useCaseGetToken.exec(user, false, routes, profile, rootCompany)
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