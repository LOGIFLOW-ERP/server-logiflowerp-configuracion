import { Request, Response } from 'express'
import {
    BaseHttpController,
    httpGet,
    httpPost,
    request,
    response
} from 'inversify-express-utils'
import { authorizeRoute } from '@Shared/Infrastructure/Middlewares'
import {
    resolveCompanyFind,
    resolveCompanyGetAll,
} from './decorators'

export class CurrencyController extends BaseHttpController {

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

}