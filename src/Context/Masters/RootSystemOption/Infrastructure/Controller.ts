import { inject } from 'inversify'
import { Request, Response } from 'express'
import { BadRequestException as BRE } from '@Config/exception'
import {
    BaseHttpController,
    httpPost,
    request,
    response
} from 'inversify-express-utils'
import { UseCaseFind } from '../Application'
import {
    UpdateUserDTO,
    UserENTITY,
    validateUUIDv4Param as VUUID,
    validateRequestBody as VRB
} from 'logiflowerp-sdk'
import { authRootMiddleware } from '@Shared/Infrastructure/Middlewares'
import { ROOT_SYSTEM_OPTION_TYPES } from './IoC'

export class RootSystemOptionController extends BaseHttpController {

    constructor(
        @inject(ROOT_SYSTEM_OPTION_TYPES.UseCaseFind) private readonly useCaseFind: UseCaseFind,
    ) {
        super()
    }

    @httpPost('find', authRootMiddleware)
    async find(@request() req: Request, @response() res: Response) {
        await this.useCaseFind.exec(req, res)
    }

    @httpPost('update-one/:id', authRootMiddleware, VUUID.bind(null, BRE), VRB.bind(null, UpdateUserDTO, BRE))
    async updateOne(@request() req: Request<any, any, UserENTITY>, @response() res: Response) {
        console.log(req.originalUrl)
        // const updatedDoc = await this.useCaseUpdateOne.exec(req.params.id, req.body)
        // res.json(updatedDoc)
    }

}