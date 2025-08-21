import { Request, Response } from 'express'
import { BadRequestException as BRE } from '@Config/exception'
import {
    BaseHttpController,
    httpDelete,
    httpGet,
    httpPost,
    httpPut,
    request,
    response
} from 'inversify-express-utils'
import {
    validateUUIDv4Param as VUUID,
    validateRequestBody as VRB,
    CreateProfileDTO,
    UpdateProfileDTO
} from 'logiflowerp-sdk'
import { authorizeRoute } from '@Shared/Infrastructure/Middlewares'
import {
    resolveCompanyDeleteOne,
    resolveCompanyFind,
    resolveCompanyGetAll,
    resolveCompanyInsertOne,
    resolveCompanyUpdateOne
} from './decorators'

export class ProfileController extends BaseHttpController {

    @httpPost('find', authorizeRoute)
    @resolveCompanyFind
    async find(@request() req: Request, @response() res: Response) {
        await req.useCase.exec(req, res)
    }

    @httpGet('', authorizeRoute)
    @resolveCompanyGetAll
    async findAll(@request() req: Request, @response() res: Response) {       
        await req.useCase.exec(req, res)
    }

    @httpPost('', authorizeRoute, VRB.bind(null, CreateProfileDTO, BRE))
    @resolveCompanyInsertOne
    async saveOne(@request() req: Request, @response() res: Response) {
        await req.useCase.exec(req.body)
        res.sendStatus(204)
    }

    @httpPut(':_id', authorizeRoute, VUUID.bind(null, BRE), VRB.bind(null, UpdateProfileDTO, BRE))
    @resolveCompanyUpdateOne
    async updateOne(@request() req: Request<ParamsPut>, @response() res: Response) {
        await req.useCase.exec(req.params._id, req.body)
        res.sendStatus(204)
    }

    @httpDelete(':_id', authorizeRoute, VUUID.bind(null, BRE))
    @resolveCompanyDeleteOne
    async deleteOne(@request() req: Request<ParamsDelete>, @response() res: Response) {
        await req.useCase.exec(req.params._id)
        res.sendStatus(204)
    }

}