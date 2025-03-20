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
import { CurrencyMongoRepository } from './MongoRepository'
import { authorizeRoute } from '@Shared/Infrastructure/Middlewares'

export class CurrencyController extends BaseHttpController {

    @httpPost('find', authorizeRoute)
    async find(@request() req: Request, @response() res: Response) {
        const repository = new CurrencyMongoRepository(req.company.code)
        await new UseCaseFind(repository).exec(req, res)
    }

    @httpGet('', authorizeRoute)
    async findAll(@request() req: Request, @response() res: Response) {
        const repository = new CurrencyMongoRepository(req.company.code)
        await new UseCaseGetAll(repository).exec(req, res)
    }

    @httpPost('', authorizeRoute, VRB.bind(null, CreateCurrencyDTO, BRE))
    async saveOne(@request() req: Request<{}, {}, CreateCurrencyDTO>, @response() res: Response) {
        const repository = new CurrencyMongoRepository(req.company.code)
        const newDoc = await new UseCaseInsertOne(repository).exec(req.body)
        res.status(201).json(newDoc)
    }

    @httpPut(':_id', authorizeRoute, VUUID.bind(null, BRE), VRB.bind(null, UpdateCurrencyDTO, BRE))
    async updateOne(@request() req: Request<ParamsPut, {}, UpdateCurrencyDTO>, @response() res: Response) {
        const repository = new CurrencyMongoRepository(req.company.code)
        const updatedDoc = await new UseCaseUpdateOne(repository).exec(req.params._id, req.body)
        res.status(200).json(updatedDoc)
    }

    @httpDelete(':_id', authorizeRoute, VUUID.bind(null, BRE))
    async deleteOne(@request() req: Request<ParamsDelete>, @response() res: Response) {
        const repository = new CurrencyMongoRepository(req.company.code)
        const updatedDoc = await new UseCaseDeleteOne(repository).exec(req.params._id)
        res.status(200).json(updatedDoc)
    }

}