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

export class PersonnelController extends BaseHttpController {

    private readonly repositoryRootUser = new RootUserMongoRepository(this.prefix_col_root)

    constructor(
        @inject(SHARED_TYPES.prefix_col_root) private readonly prefix_col_root: string,
    ) {
        super()
    }

    @httpPost('find')
    async find(@request() req: Request, @response() res: Response) {
        const repository = new PersonnelMongoRepository(req.company.code)
        await new UseCaseFind(repository).exec(req, res)
    }

    @httpGet('')
    async findAll(@request() req: Request, @response() res: Response) {
        const repository = new PersonnelMongoRepository(req.company.code)
        await new UseCaseGetAll(repository).exec(req, res)
    }

    @httpPost('', VRB.bind(null, CreateEmployeeDTO, BRE))
    async saveOne(@request() req: Request<{}, {}, CreateEmployeeDTO>, @response() res: Response) {
        const repository = new PersonnelMongoRepository(req.company.code)
        const newDoc = await new UseCaseInsertOne(repository, this.repositoryRootUser).exec(req.body)
        res.status(201).json(newDoc)
    }

    @httpPut(':_id', VUUID.bind(null, BRE), VRB.bind(null, UpdateEmployeeDTO, BRE))
    async updateOne(@request() req: Request<ParamsPut, {}, UpdateEmployeeDTO>, @response() res: Response) {
        const repository = new PersonnelMongoRepository(req.company.code)
        const updatedDoc = await new UseCaseUpdateOne(repository).exec(req.params._id, req.body)
        res.status(200).json(updatedDoc)
    }

    @httpDelete(':_id', VUUID.bind(null, BRE))
    async deleteOne(@request() req: Request<ParamsDelete>, @response() res: Response) {
        const repository = new PersonnelMongoRepository(req.company.code)
        const updatedDoc = await new UseCaseDeleteOne(repository).exec(req.params._id)
        res.status(200).json(updatedDoc)
    }

}