import { Request, Response } from 'express'
import {
    BaseHttpController,
    httpGet,
    httpPost,
    httpPut,
    request,
    response
} from 'inversify-express-utils'
import {
    UpdateUserDTO,
    validateRequestBody as VRB,
    validateUUIDv4Param as VUUID,
} from 'logiflowerp-sdk'
import { BadRequestException as BRE } from '@Config/exception'
import { authorizeRoute, authRootCompanyMiddleware } from '@Shared/Infrastructure/Middlewares'
import {
    resolveCompanyGetAll,
    resolveCompanyGetByIdentity,
    resolveCompanyUpdateOne
} from './decorators'

export class UserController extends BaseHttpController {
    @httpPost('find', authRootCompanyMiddleware, authorizeRoute)
    async find(@request() req: Request, @response() res: Response) {
        // await this.useCaseFind.exec(req, res)
    }

    // @httpGet('', authRootCompanyMiddleware, authorizeRoute)
    @httpGet('', authorizeRoute)
    @resolveCompanyGetAll
    async findAll(@request() req: Request, @response() res: Response) {
        await req.useCase.exec(req, res)
    }

    // @httpGet(':identity', authRootCompanyMiddleware, authorizeRoute)
    @httpGet(':identity', authorizeRoute)
    @resolveCompanyGetByIdentity
    async getByIdentity(@request() req: Request<{ identity: string }>, @response() res: Response) {
        const doc = await req.useCase.exec(req.params.identity)
        res.status(200).json(doc)
    }

    // @httpPut(':_id', authRootCompanyMiddleware, authorizeRoute, VUUID.bind(null, BRE), VRB.bind(null, UpdateUserDTO, BRE))
    @httpPut(':_id', authorizeRoute, VUUID.bind(null, BRE), VRB.bind(null, UpdateUserDTO, BRE))
    @resolveCompanyUpdateOne
    async updateOne(@request() req: Request<ParamsPut>, @response() res: Response) {
        await req.useCase.exec(req.params._id, req.body)
        res.sendStatus(204)
    }
}