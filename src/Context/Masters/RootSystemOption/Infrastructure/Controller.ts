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
import { SHARED_TYPES } from '@Shared/Infrastructure'
import { RootSystemOptionMongoRepository } from './MongoRepository'
import { authRootMiddleware } from '@Shared/Infrastructure/Middlewares'

export class RootSystemOptionController extends BaseHttpController {

    private readonly repository = new RootSystemOptionMongoRepository(this.prefix_col_root)

    constructor(
        @inject(SHARED_TYPES.prefix_col_root) private readonly prefix_col_root: string,
    ) {
        super()
    }

    @httpPost('find', authRootMiddleware)
    async find(@request() req: Request, @response() res: Response) {
        await new UseCaseFind(this.repository).exec(req, res)
    }

    @httpPost('update-one/:id', authRootMiddleware, VUUID.bind(null, BRE), VRB.bind(null, UpdateUserDTO, BRE))
    async updateOne(@request() req: Request<any, any, UserENTITY>, @response() res: Response) {
        console.log(req.originalUrl)
        // const updatedDoc = await this.useCaseUpdateOne.exec(req.params.id, req.body)
        // res.json(updatedDoc)
    }

}