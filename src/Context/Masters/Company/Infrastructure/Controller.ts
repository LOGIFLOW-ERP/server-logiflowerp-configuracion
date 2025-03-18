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
    CreateCompanyDTO,
    CreateCompanyPERDTO,
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
import { CompanyMongoRepository } from './MongoRepository'
import { AdapterApiRequest, SHARED_TYPES } from '@Shared/Infrastructure'

export class CompanyController extends BaseHttpController {

    constructor(
        @inject(SHARED_TYPES.AdapterApiRequest) private readonly adapterApiRequest: AdapterApiRequest,
    ) {
        super()
    }

    @httpPost('find')
    async find(@request() req: Request, @response() res: Response) {
        const repository = new CompanyMongoRepository(req.company.code)
        await new UseCaseFind(repository).exec(req, res)
    }

    @httpGet('')
    async findAll(@request() req: Request, @response() res: Response) {
        const repository = new CompanyMongoRepository(req.company.code)
        await new UseCaseGetAll(repository).exec(req, res)
    }

    @httpPost('')
    async saveOne(@request() req: Request, @response() res: Response) {
        const { country } = req.body
        if (!country) {
            throw new BadRequestException(`El campo "country" es requerido`)
        }

        const countryConfigs: Record<string, { dto: any; useCase: any }> = {
            PER: { dto: CreateCompanyPERDTO, useCase: UseCaseInsertOnePER },
        }

        const config = countryConfigs[country] || { dto: CreateCompanyDTO, useCase: UseCaseInsertOne }

        const validatedBody = await validateCustom(req.body, config.dto, BRE)
        const repository = new CompanyMongoRepository(req.company.code)
        const newDoc = await new config.useCase(repository, this.adapterApiRequest).exec(validatedBody)
        res.status(201).json(newDoc)
    }

    @httpPut(':_id', VUUID.bind(null, BRE), VRB.bind(null, UpdateCompanyDTO, BRE))
    async updateOne(@request() req: Request, @response() res: Response) {
        const repository = new CompanyMongoRepository(req.company.code)
        const updatedDoc = await new UseCaseUpdateOne(repository).exec(req.params._id, req.body)
        res.status(200).json(updatedDoc)
    }

    @httpDelete(':_id', VUUID.bind(null, BRE))
    async deleteOne(@request() req: Request, @response() res: Response) {
        const repository = new CompanyMongoRepository(req.company.code)
        const updatedDoc = await new UseCaseDeleteOne(repository).exec(req.params._id)
        res.status(200).json(updatedDoc)
    }

}