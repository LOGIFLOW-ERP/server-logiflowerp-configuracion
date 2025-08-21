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
    UseCaseChangePassword,
    UseCaseGetPersonnel,
    UseCaseGetProfile,
    UseCaseGetRootCompany,
    UseCaseGetRootSystemOption,
    UseCaseGetToken,
    UseCaseRequestPasswordReset,
    UseCaseResendMailRegisterUser,
    UseCaseResetPassword,
    UseCaseSignIn,
    UseCaseSignUp,
    UseCaseVerifyEmail
} from '../Application'
import {
    ChangePasswordDTO,
    collections,
    CreateUserDTO,
    EmployeeAuthDTO,
    getQueueNameMailRegisterUser,
    ProfileDTO,
    ProfileENTITY,
    ResetPasswordDTO,
    ResponseSignIn,
    SignInDTO,
    SystemOptionENTITY,
    validateRequestBody as VRB
} from 'logiflowerp-sdk'
import { AdapterRabbitMQ, createTenantScopedContainer, SHARED_TYPES } from '@Shared/Infrastructure'
import { DataRequestPasswordResetDTO, DataRequestResendMailRegisterUser, DataVerifyEmailDTO } from '../Domain'
import { ProfileMongoRepository } from '@Masters/Profile/Infrastructure/MongoRepository'
import { PersonnelMongoRepository } from '@Masters/Personnel/Infrastructure/MongoRepository'
import { AUTH_TYPES } from './IoC'
import { PERSONNEL_TYPES } from '@Masters/Personnel/Infrastructure/IoC'
import { PROFILE_TYPES } from '@Masters/Profile/Infrastructure/IoC'
import { CONFIG_TYPES } from '@Config/types'

export class RootAuthController extends BaseHttpController {
    constructor(
        @inject(SHARED_TYPES.AdapterRabbitMQ) private readonly adapterRabbitMQ: AdapterRabbitMQ,
        @inject(AUTH_TYPES.UseCaseSignUp) private readonly useCaseSignUp: UseCaseSignUp,
        @inject(AUTH_TYPES.UseCaseVerifyEmail) private readonly useCaseVerifyEmail: UseCaseVerifyEmail,
        @inject(AUTH_TYPES.UseCaseRequestPasswordReset) private readonly useCaseRequestPasswordReset: UseCaseRequestPasswordReset,
        @inject(AUTH_TYPES.UseCaseResetPassword) private readonly useCaseResetPassword: UseCaseResetPassword,
        @inject(AUTH_TYPES.UseCaseGetToken) private readonly useCaseGetToken: UseCaseGetToken,
        @inject(AUTH_TYPES.UseCaseSignIn) private readonly useCaseSignIn: UseCaseSignIn,
        @inject(AUTH_TYPES.UseCaseGetRootCompany) private readonly useCaseGetRootCompany: UseCaseGetRootCompany,
        @inject(AUTH_TYPES.UseCaseGetRootSystemOption) private readonly useCaseGetRootSystemOption: UseCaseGetRootSystemOption,
        @inject(AUTH_TYPES.UseCaseChangePassword) private readonly useCaseChangePassword: UseCaseChangePassword,
        @inject(AUTH_TYPES.UseCaseResendMailRegisterUser) private readonly useCaseResendMailRegisterUser: UseCaseResendMailRegisterUser,
        @inject(CONFIG_TYPES.Env) private readonly env: Env,
    ) {
        super()
    }

    @httpPost('sign-up', VRB.bind(null, CreateUserDTO, BRE))
    async saveOne(@request() req: Request<{}, {}, CreateUserDTO>, @response() res: Response) {
        const newDoc = await this.useCaseSignUp.exec(req.body, req.tenant)
        const message = {
            entity: newDoc,
            origin: req.headers.origin || '',
        }
        await this.adapterRabbitMQ.publish({ queue: getQueueNameMailRegisterUser({ NODE_ENV: this.env.NODE_ENV, PREFIX: this.env.PREFIX }), message })
        res.status(201).json(newDoc)
    }

    @httpPost('verify-email', VRB.bind(null, DataVerifyEmailDTO, BRE))
    async verifyEmail(@request() req: Request<{}, {}, DataVerifyEmailDTO>, @response() res: Response) {
        await this.useCaseVerifyEmail.exec(req.body, req.tenant)
        res.sendStatus(204)
    }

    @httpPost('request-password-reset', VRB.bind(null, DataRequestPasswordResetDTO, BRE))
    async requestPasswordReset(@request() req: Request<{}, {}, DataRequestPasswordResetDTO>, @response() res: Response) {
        await this.useCaseRequestPasswordReset.exec(req.body.email, req.tenant, req.headers.origin || '')
        res.sendStatus(204)
    }

    @httpPost('reset-password', VRB.bind(null, ResetPasswordDTO, BRE))
    async resetPassword(@request() req: Request<{}, {}, ResetPasswordDTO>, @response() res: Response) {
        await this.useCaseResetPassword.exec(req.body.token, req.body.password, req.tenant)
        res.sendStatus(204)
    }

    @httpPost('change-password', VRB.bind(null, ChangePasswordDTO, BRE))
    async changePassword(@request() req: Request<{}, {}, ChangePasswordDTO>, @response() res: Response) {
        await this.useCaseChangePassword.exec(req.user, req.body, req.tenant)
        res.sendStatus(204)
    }

    @httpPost('sign-in', VRB.bind(null, SignInDTO, BRE))
    async signIn(@request() req: Request<{}, {}, SignInDTO>, @response() res: Response) {
        const { user } = await this.useCaseSignIn.exec(req.body, req.tenant)
        const { rootCompany, isRoot, companyAuth } = await this.useCaseGetRootCompany.exec(user, req.tenant)
        user.root = isRoot
        let dataSystemOptions: SystemOptionENTITY[] = []
        let tags: string[] = []
        let profile: ProfileENTITY | undefined
        const profileAuth = new ProfileDTO()
        const personnelAuth = new EmployeeAuthDTO()
        if (!isRoot) {
            const tenantContainerGetPersonnel = createTenantScopedContainer(
                AUTH_TYPES.UseCaseGetPersonnel,
                PERSONNEL_TYPES.RepositoryMongo,
                UseCaseGetPersonnel,
                PersonnelMongoRepository,
                req.tenant,
                collections.employee,
                user
            )
            const useCaseGetPersonnel = tenantContainerGetPersonnel.get<UseCaseGetPersonnel>(AUTH_TYPES.UseCaseGetPersonnel)
            const { personnel } = await useCaseGetPersonnel.exec(user)
            if (personnel) {
                const tenantContainerGetProfile = createTenantScopedContainer(
                    AUTH_TYPES.UseCaseGetProfile,
                    PROFILE_TYPES.RepositoryMongo,
                    UseCaseGetProfile,
                    ProfileMongoRepository,
                    req.tenant,
                    collections.profile,
                    user
                )
                const useCaseGetProfile = tenantContainerGetProfile.get<UseCaseGetProfile>(AUTH_TYPES.UseCaseGetProfile)
                const profileAux = await useCaseGetProfile.exec(personnel)
                const { systemOptions, _tags } = await this.useCaseGetRootSystemOption.exec(profileAux)
                dataSystemOptions = systemOptions
                tags = _tags
                profile = profileAux
                profileAuth.set(profileAux)
                personnelAuth.set(personnel)
            }
        } else {
            const { systemOptions, _tags } = await this.useCaseGetRootSystemOption.execRoot(rootCompany)
            dataSystemOptions = systemOptions
            tags = _tags
        }
        const { token, user: userResponse } = await this.useCaseGetToken.exec(user, rootCompany, profile, personnelAuth)
        res.cookie(
            'authToken',
            token,
            {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            }
        )
        const response: ResponseSignIn = {
            user: userResponse,
            dataSystemOptions,
            tags,
            company: companyAuth,
            profile: profileAuth,
            personnel: personnelAuth
        }
        res.status(200).json(response)
    }

    @httpPost('sign-out')
    async signOut(@request() _req: Request, @response() res: Response) {
        res.clearCookie('authToken')
        res.sendStatus(204)
    }

    @httpPost('resend-mail-register-user', VRB.bind(null, DataRequestResendMailRegisterUser, BRE))
    async resendMailRegisterUser(@request() req: Request<{}, {}, DataRequestResendMailRegisterUser>, @response() res: Response) {
        const newDoc = await this.useCaseResendMailRegisterUser.exec(req.body, req.tenant)
        const message = {
            entity: newDoc,
            origin: req.headers.origin || '',
        }
        await this.adapterRabbitMQ.publish({ queue: getQueueNameMailRegisterUser({ NODE_ENV: this.env.NODE_ENV, PREFIX: this.env.PREFIX }), message })
        res.status(201).json(newDoc)
    }

}