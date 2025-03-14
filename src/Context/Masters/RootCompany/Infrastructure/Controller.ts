import { inject } from 'inversify'
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
    CreateRootCompanyDTO,
    CreateRootCompanyPERDTO,
    UpdateCompanyDTO,
    validateCustom,
    validateRequestBody as VRB,
    validateUUIDv4Param as VUUID,
} from 'logiflowerp-sdk'
import { BadRequestException, BadRequestException as BRE } from '@Config/exception'
import {
    UseCaseDeleteOne,
    UseCaseFind,
    UseCaseGetAll,
    UseCaseInsertOne,
    UseCaseInsertOnePER,
    UseCaseUpdateOne
} from '../Application'
import { RootCompanyMongoRepository } from './MongoRepository'
import { AdapterApiRequest, SHARED_TYPES } from '@Shared/Infrastructure'
import { authRootMiddleware } from '@Shared/Infrastructure/Middlewares'

export class RootCompanyController extends BaseHttpController {

    private readonly repository = new RootCompanyMongoRepository(this.prefix_col_root)

    constructor(
        @inject(SHARED_TYPES.AdapterApiRequest) private readonly adapterApiRequest: AdapterApiRequest,
        @inject(SHARED_TYPES.prefix_col_root) private readonly prefix_col_root: string,
    ) {
        super()
    }

    @httpPost('find', authRootMiddleware)
    async find(@request() req: Request, @response() res: Response) {
        await new UseCaseFind(this.repository).exec(req, res)
    }

    @httpGet('', authRootMiddleware)
    async findAll(@request() req: Request, @response() res: Response) {
        await new UseCaseGetAll(this.repository).exec(req, res)
    }

    @httpPost('', authRootMiddleware)
    async saveOne(@request() req: Request, @response() res: Response) {

        const { country } = req.body
        if (!country) {
            throw new BadRequestException(`El campo "country" es requerido`)
        }

        const countryConfigs: Record<string, { dto: any; useCase: any }> = {
            PER: { dto: CreateRootCompanyPERDTO, useCase: UseCaseInsertOnePER },
        }

        const config = countryConfigs[country] || { dto: CreateRootCompanyDTO, useCase: UseCaseInsertOne }

        const validatedBody = await validateCustom(req.body, config.dto, BRE)
        const newDoc = await new config.useCase(this.repository, this.adapterApiRequest).exec(validatedBody)
        res.status(201).json(newDoc)
    }

    @httpPut(':_id', authRootMiddleware, VUUID.bind(null, BRE), VRB.bind(null, UpdateCompanyDTO, BRE))
    async updateOne(@request() req: Request, @response() res: Response) {
        const updatedDoc = await new UseCaseUpdateOne(this.repository).exec(req.params._id, req.body)
        res.status(200).json(updatedDoc)
    }

    @httpDelete(':_id', authRootMiddleware, VUUID.bind(null, BRE))
    async deleteOne(@request() req: Request, @response() res: Response) {
        const updatedDoc = await new UseCaseDeleteOne(this.repository).exec(req.params._id)
        res.status(200).json(updatedDoc)
    }

}