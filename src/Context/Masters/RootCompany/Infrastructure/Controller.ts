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
    UpdateRootCompanyDTO,
    validateCustom,
    validateRequestBody as VRB,
    validateUUIDv4Param as VUUID,
} from 'logiflowerp-sdk'
import { BadRequestException, BadRequestException as BRE } from '@Config/exception'
import {
    UseCaseDeleteOne,
    UseCaseFind,
    UseCaseGetActive,
    UseCaseGetAll,
    UseCaseInsertOne,
    UseCaseInsertOnePER,
    UseCaseUpdateOne
} from '../Application'
import { authRootMiddleware } from '@Shared/Infrastructure/Middlewares'
import { ROOT_COMPANY_TYPES } from './IoC'
import { initCollections } from '@Config/collections'

export class RootCompanyController extends BaseHttpController {

    constructor(
        @inject(ROOT_COMPANY_TYPES.UseCaseDeleteOne) private readonly useCaseDeleteOne: UseCaseDeleteOne,
        @inject(ROOT_COMPANY_TYPES.UseCaseFind) private readonly useCaseFind: UseCaseFind,
        @inject(ROOT_COMPANY_TYPES.UseCaseGetActive) private readonly useCaseGetActive: UseCaseGetActive,
        @inject(ROOT_COMPANY_TYPES.UseCaseGetAll) private readonly useCaseGetAll: UseCaseGetAll,
        @inject(ROOT_COMPANY_TYPES.UseCaseInsertOne) private readonly useCaseInsertOne: UseCaseInsertOne,
        @inject(ROOT_COMPANY_TYPES.UseCaseInsertOnePER) private readonly useCaseInsertOnePER: UseCaseInsertOnePER,
        @inject(ROOT_COMPANY_TYPES.UseCaseUpdateOne) private readonly useCaseUpdateOne: UseCaseUpdateOne,
    ) {
        super()
    }

    @httpPost('find', authRootMiddleware)
    async find(@request() req: Request, @response() res: Response) {
        await this.useCaseFind.exec(req, res)
    }

    @httpGet('', authRootMiddleware)
    async findAll(@request() req: Request, @response() res: Response) {
        await this.useCaseGetAll.exec(req, res)
    }

    @httpGet('get-active')
    async getActive(@request() req: Request, @response() res: Response) {
        await this.useCaseGetActive.exec(req, res)
    }

    @httpPost('', authRootMiddleware)
    async saveOne(@request() req: Request<{}, {}, CreateRootCompanyPERDTO | CreateRootCompanyDTO>, @response() res: Response) {

        const { country } = req.body
        if (!country) {
            throw new BadRequestException(`El campo "country" es requerido`)
        }

        const countryConfigs: Record<string, { dto: any; useCase: any }> = {
            PER: { dto: CreateRootCompanyPERDTO, useCase: this.useCaseInsertOnePER },
        }

        const config = countryConfigs[country] || { dto: CreateRootCompanyDTO, useCase: this.useCaseInsertOne }

        const validatedBody = await validateCustom(req.body, config.dto, BRE)
        const result = await config.useCase.exec(validatedBody)
        await initCollections([result])
        res.sendStatus(204)
    }

    @httpPut(':_id', authRootMiddleware, VUUID.bind(null, BRE), VRB.bind(null, UpdateRootCompanyDTO, BRE))
    async updateOne(@request() req: Request<ParamsPut, {}, UpdateRootCompanyDTO>, @response() res: Response) {
        await this.useCaseUpdateOne.exec(req.params._id, req.body)
        res.sendStatus(204)
    }

    @httpDelete(':_id', authRootMiddleware, VUUID.bind(null, BRE))
    async deleteOne(@request() req: Request<ParamsDelete>, @response() res: Response) {
        await this.useCaseDeleteOne.exec(req.params._id)
        res.sendStatus(204)
    }

}