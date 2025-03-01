import { inject } from 'inversify'
import { USER_TYPES } from './IoC'
import { Request, Response } from 'express'
import { BadRequestException as BRE } from '@Config/exception'
import {
    BaseHttpController,
    httpPost,
    request,
    response
} from 'inversify-express-utils'
import {
    UseCaseFind,
    UseCaseUpdateOne
} from '../Application'
import {
    UpdateUserDTO,
    UserENTITY,
    validateUUIDv4Param as VUUID,
    validateRequestBody as VRB
} from 'logiflowerp-sdk'

export class UserController extends BaseHttpController {

    constructor(
        @inject(USER_TYPES.UseCaseFind) private readonly useCaseFind: UseCaseFind,
        @inject(USER_TYPES.UseCaseUpdateOne) private readonly useCaseUpdateOne: UseCaseUpdateOne,
    ) {
        super()
    }

    @httpPost('find')
    async find(@request() req: Request, @response() res: Response) {
        console.log(req.originalUrl)
        await this.useCaseFind.exec(req, res)
    }

    @httpPost('update-one/:id', VUUID.bind(null, BRE), VRB.bind(null, UpdateUserDTO, BRE))
    async updateOne(@request() req: Request<any, any, UserENTITY>, @response() res: Response) {
        console.log(req.originalUrl)
        const updatedDoc = await this.useCaseUpdateOne.exec(req.params.id, req.body)
        res.json(updatedDoc)
    }

}