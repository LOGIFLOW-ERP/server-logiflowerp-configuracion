import { inject } from 'inversify'
import { USER_TYPES } from './IoC'
import { Request, Response } from 'express'
import { BadRequestException as BRE } from '@Config'
import {
    BaseHttpController,
    httpPost,
    request,
    response
} from 'inversify-express-utils'
import {
    UseCaseFind,
    UseCaseInsertOne,
    UseCaseUpdateOne
} from '../Application'
import {
    UserENTITY,
    validateObjectIdParam as VOIP,
    validateRequestBody as VRB
} from 'logiflowerp-sdk'

export class UserController extends BaseHttpController {

    constructor(
        @inject(USER_TYPES.UseCaseFind) private readonly useCaseFind: UseCaseFind,
        @inject(USER_TYPES.UseCaseInsertOne) private readonly useCaseSaveOne: UseCaseInsertOne,
        @inject(USER_TYPES.UseCaseUpdateOne) private readonly useCaseUpdateOne: UseCaseUpdateOne,
    ) {
        super()
    }

    @httpPost('find')
    async find(@request() req: Request, @response() res: Response) {
        await this.useCaseFind.exec(req, res)
    }

    @httpPost('insert-one', /*VRB.bind(null, UserENTITY, BRE)*/)
    async saveOne(@request() req: Request<any, any, UserENTITY>, @response() res: Response) {
        const newDoc = await this.useCaseSaveOne.exec(req.body)
        res.status(201).json(newDoc)
    }

    @httpPost('update-one/:id', VOIP.bind(null, BRE), VRB.bind(null, UserENTITY, BRE))
    async updateOne(@request() req: Request<any, any, UserENTITY>, @response() res: Response) {
        const updatedDoc = await this.useCaseUpdateOne.exec(req.params.id, req.body)
        res.json(updatedDoc)
    }

}