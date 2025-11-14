import { Request, Response } from 'express'
import { BadRequestException as BRE } from '@Config/exception'
import {
    BaseHttpController,
    httpGet,
    httpPut,
    request,
    response
} from 'inversify-express-utils'
import {
    validateUUIDv4Param as VUUID,
    validateRequestBody as VRB,
    UpdateNotificationDTO
} from 'logiflowerp-sdk'
import { authorizeRoute } from '@Shared/Infrastructure/Middlewares'
import {
    resolveCompanyGetAll,
    resolveCompanyUpdateOne
} from './decorators'

export class RootNotificationController extends BaseHttpController {
    @httpGet('')
    @resolveCompanyGetAll
    async findAll(@request() req: Request, @response() res: Response) {
        await req.useCase.exec(req, res)
    }

    @httpPut(':_id', VUUID.bind(null, BRE), VRB.bind(null, UpdateNotificationDTO, BRE))
    @resolveCompanyUpdateOne
    async updateOne(@request() req: Request<ParamsPut>, @response() res: Response) {
        await req.useCase.exec(req.params._id, req.body)
        res.sendStatus(204)
    }
}