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
    UseCaseSignUp
} from '../Application'
import {
    CreateUserDTO,
    validateRequestBody as VRB
} from 'logiflowerp-sdk'
import { AdapterRabbitMQ, SHARED_QUEUES, SHARED_TYPES } from '@Shared/Infrastructure'

export class AuthController extends BaseHttpController {

    constructor(
        @inject(AUTH_TYPES.UseCaseSignUp) private readonly useCaseSignUp: UseCaseSignUp,
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

}