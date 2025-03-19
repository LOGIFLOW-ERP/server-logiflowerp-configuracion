import { inject } from 'inversify'
import { Request, Response } from 'express'
import { BadRequestException as BRE } from '@Config/exception'
import {
    BaseHttpController,
    httpGet,
    httpPost,
    request,
    response
} from 'inversify-express-utils'
import {
    UseCaseFind,
    UseCaseGetByIdentity,
    UseCaseUpdateOne
} from '../Application'
import {
    UpdateUserDTO,
    UserENTITY,
    validateUUIDv4Param as VUUID,
    validateRequestBody as VRB
} from 'logiflowerp-sdk'
import { SHARED_TYPES } from '@Shared/Infrastructure'
import { RootUserMongoRepository } from './MongoRepository'
import { authRootCompanyMiddleware, authRootMiddleware } from '@Shared/Infrastructure/Middlewares'

export class RootUserController extends BaseHttpController {

    private readonly repository = new RootUserMongoRepository(this.prefix_col_root)

    constructor(
        @inject(SHARED_TYPES.prefix_col_root) private readonly prefix_col_root: string,
    ) {
        super()
    }

    @httpPost('find', authRootMiddleware)
    async find(@request() req: Request, @response() res: Response) {
        await new UseCaseFind(this.repository).exec(req, res)
    }

    @httpGet(':identity', authRootCompanyMiddleware)
    async getByIdentity(@request() req: Request<{ identity: string }>, @response() res: Response) {
        const doc = await new UseCaseGetByIdentity(this.repository).exec(req.params.identity)
        res.status(200).json(doc)
    }

}