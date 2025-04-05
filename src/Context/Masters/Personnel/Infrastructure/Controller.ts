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
    CreateEmployeeDTO,
    UpdateEmployeeDTO,
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
import { PersonnelMongoRepository } from './MongoRepository'
import { RootUserMongoRepository } from '@Masters/RootUser/Infrastructure/MongoRepository'
import { SHARED_TYPES } from '@Shared/Infrastructure'
import { inject } from 'inversify'
import { authorizeRoute } from '@Shared/Infrastructure/Middlewares'
import { resolveCompanyDeleteOne, resolveCompanyFind, resolveCompanyGetAll, resolveCompanyInsertOne, resolveCompanyUpdateOne } from './decorators'

export class PersonnelController extends BaseHttpController {

    private readonly repositoryRootUser = new RootUserMongoRepository(this.prefix_col_root)

    constructor(
        @inject(SHARED_TYPES.prefix_col_root) private readonly prefix_col_root: string,
    ) {
        super()
    }

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

    @httpPost('', VRB.bind(null, CreateEmployeeDTO, BRE))
    @resolveCompanyInsertOne
    async saveOne(@request() req: Request, @response() res: Response) {
        const newDoc = await req.useCase.exec(req.body)
        res.status(201).json(newDoc)
    }

    @httpPut(':_id', authorizeRoute, VUUID.bind(null, BRE), VRB.bind(null, UpdateEmployeeDTO, BRE))
    @resolveCompanyUpdateOne
    async updateOne(@request() req: Request<ParamsPut>, @response() res: Response) {
        const updatedDoc = await req.useCase.exec(req.params._id, req.body)
        res.status(200).json(updatedDoc)
    }

    @httpDelete(':_id', authorizeRoute, VUUID.bind(null, BRE))
    @resolveCompanyDeleteOne
    async deleteOne(@request() req: Request<ParamsDelete>, @response() res: Response) {
        const updatedDoc = await req.useCase.exec(req.params._id)
        res.status(200).json(updatedDoc)
    }

}