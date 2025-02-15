import { inject } from 'inversify'
import { ENDPOINT_TYPES } from './IoC'
import { Request, Response } from 'express'
import {
    BaseHttpController,
    httpPost,
    request,
    response
} from 'inversify-express-utils'
import { UseCaseFind } from '../Application'

export class EndpointController extends BaseHttpController {

    constructor(
        @inject(ENDPOINT_TYPES.UseCaseFind) private readonly useCaseFind: UseCaseFind
    ) {
        super()
    }

    @httpPost('find')
    async find(@request() req: Request, @response() res: Response) {
        await this.useCaseFind.exec(req, res)
    }

}