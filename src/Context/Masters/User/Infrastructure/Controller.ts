import { Request, Response } from 'express'
import {
    BaseHttpController,
    httpGet,
    httpPost,
    request,
    response
} from 'inversify-express-utils'
import { authRootCompanyMiddleware } from '@Shared/Infrastructure/Middlewares'
import { resolveCompanyGetByIdentity } from './decorators'

export class UserController extends BaseHttpController {
    @httpPost('find')
    async find(@request() req: Request, @response() res: Response) {
        // await this.useCaseFind.exec(req, res)
    }

    @httpGet(':identity', authRootCompanyMiddleware)
    @resolveCompanyGetByIdentity
    async getByIdentity(@request() req: Request<{ identity: string }>, @response() res: Response) {
        const doc = await req.useCase.exec(req.params.identity)
        res.status(200).json(doc)
    }
}