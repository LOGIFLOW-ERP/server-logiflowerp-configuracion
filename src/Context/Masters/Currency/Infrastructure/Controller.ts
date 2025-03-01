import { inject } from 'inversify'
import { CURRENCY_TYPES } from './IoC'
import { Request, Response } from 'express'
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
    CreateCurrencyDTO,
    UpdateCurrencyDTO,
    validateRequestBody as VRB,
    validateUUIDv4Param as VUUID,
} from 'logiflowerp-sdk'
import { BadRequestException as BRE } from '@Config/exception'
import {
    UseCaseDeleteOne,
    UseCaseFind,
    UseCaseGetAll,
    UseCaseInsertOne,
    UseCaseUpdateOne
} from '../Application'

export class CurrencyController extends BaseHttpController {

    constructor(
        @inject(CURRENCY_TYPES.UseCaseFind) private readonly useCaseFind: UseCaseFind,
        @inject(CURRENCY_TYPES.UseCaseGetAll) private readonly useCaseGetAll: UseCaseGetAll,
        @inject(CURRENCY_TYPES.UseCaseInsertOne) private readonly useCaseInsertOne: UseCaseInsertOne,
        @inject(CURRENCY_TYPES.UseCaseUpdateOne) private readonly useCaseUpdateOne: UseCaseUpdateOne,
        @inject(CURRENCY_TYPES.UseCaseDeleteOne) private readonly useCaseDeleteOne: UseCaseDeleteOne,
    ) {
        super()
    }

    @httpPost('find')
    async find(@request() req: Request, @response() res: Response) {
        await this.useCaseFind.exec(req, res)
    }

    @httpGet('')
    async findAll(@request() req: Request, @response() res: Response) {
        await this.useCaseGetAll.exec(req, res)
    }

    @httpPost('', VRB.bind(null, CreateCurrencyDTO, BRE))
    async saveOne(@request() req: Request, @response() res: Response) {
        const newDoc = await this.useCaseInsertOne.exec(req.body)
        res.status(201).json(newDoc)
    }

    @httpPut(':_id', VUUID.bind(null, BRE), VRB.bind(null, UpdateCurrencyDTO, BRE))
    async updateOne(@request() req: Request, @response() res: Response) {
        const updatedDoc = await this.useCaseUpdateOne.exec(req.params._id, req.body)
        res.status(200).json(updatedDoc)
    }

    @httpDelete(':_id', VUUID.bind(null, BRE))
    async deleteOne(@request() req: Request, @response() res: Response) {
        const updatedDoc = await this.useCaseDeleteOne.exec(req.params._id)
        res.status(200).json(updatedDoc)
    }

}