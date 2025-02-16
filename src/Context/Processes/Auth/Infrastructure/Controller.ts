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

export class AuthController extends BaseHttpController {

    constructor(
        @inject(AUTH_TYPES.UseCaseSignUp) private readonly useCaseSignUp: UseCaseSignUp,
    ) {
        super()
    }

    @httpPost('sign-up', VRB.bind(null, CreateUserDTO, BRE))
    async saveOne(@request() req: Request<any, any, CreateUserDTO>, @response() res: Response) {
        const newDoc = await this.useCaseSignUp.exec(req.body)
        res.status(201).json(newDoc)
    }

}