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
    UseCaseSignUp,
    UseCaseVerifyEmail
} from '../Application'
import {
    CreateUserDTO,
    validateRequestBody as VRB
} from 'logiflowerp-sdk'
import { AdapterRabbitMQ, SHARED_QUEUES, SHARED_TYPES } from '@Shared/Infrastructure'
import { DataVerifyEmailDTO } from '../Domain'

export class AuthController extends BaseHttpController {

    constructor(
        @inject(AUTH_TYPES.UseCaseSignUp) private readonly useCaseSignUp: UseCaseSignUp,
        @inject(AUTH_TYPES.UseCaseVerifyEmail) private readonly useCaseVerifyEmail: UseCaseVerifyEmail,
        @inject(SHARED_TYPES.AdapterRabbitMQ) private readonly adapterRabbitMQ: AdapterRabbitMQ,
    ) {
        super()
    }

    @httpPost('sign-up', VRB.bind(null, CreateUserDTO, BRE))
    async saveOne(@request() req: Request<any, any, CreateUserDTO>, @response() res: Response) {
        const newDoc = await this.useCaseSignUp.exec(req.body)
        await this.adapterRabbitMQ.publish({ queue: SHARED_QUEUES.MAIL_REGISTER_USER, message: newDoc })
        res.status(201).json(newDoc)
    }

    @httpPost('verify-email', VRB.bind(null, DataVerifyEmailDTO, BRE))
    async verifyEmail(@request() req: Request, @response() res: Response) {
        await this.useCaseVerifyEmail.exec(req.body)
        res.status(200).end()
    }

}