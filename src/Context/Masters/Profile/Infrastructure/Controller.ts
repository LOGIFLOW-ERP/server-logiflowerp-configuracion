import { Request, Response } from 'express'
import { BadRequestException as BRE } from '@Config/exception'
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
    UseCaseDeleteOne,
    UseCaseFind,
    UseCaseGetAll,
    UseCaseInsertOne,
    UseCaseUpdateOne
} from '../Application'
import {
    validateUUIDv4Param as VUUID,
    validateRequestBody as VRB,
    CreateProfileDTO,
    UpdateProfileDTO
} from 'logiflowerp-sdk'
import { ProfileMongoRepository } from './MongoRepository'

export class ProfileController extends BaseHttpController {

    @httpPost('find')
    async find(@request() req: Request, @response() res: Response) {
        const repository = new ProfileMongoRepository(req.company.code)
        await new UseCaseFind(repository).exec(req, res)
    }

    @httpGet('')
    async findAll(@request() req: Request, @response() res: Response) {
        const repository = new ProfileMongoRepository(req.company.code)
        await new UseCaseGetAll(repository).exec(req, res)
    }

    @httpPost('', VRB.bind(null, CreateProfileDTO, BRE))
    async saveOne(@request() req: Request<{}, {}, CreateProfileDTO>, @response() res: Response) {
        const repository = new ProfileMongoRepository(req.company.code)
        await new UseCaseInsertOne(repository).exec(req.body)
        res.sendStatus(204)
    }

    @httpPut(':_id', VUUID.bind(null, BRE), VRB.bind(null, UpdateProfileDTO, BRE))
    async updateOne(@request() req: Request<ParamsPut, {}, UpdateProfileDTO>, @response() res: Response) {
        const repository = new ProfileMongoRepository(req.company.code)
        await new UseCaseUpdateOne(repository).exec(req.params._id, req.body)
        res.sendStatus(204)
    }

    @httpDelete(':_id', VUUID.bind(null, BRE))
    async deleteOne(@request() req: Request<ParamsDelete>, @response() res: Response) {
        const repository = new ProfileMongoRepository(req.company.code)
        await new UseCaseDeleteOne(repository).exec(req.params._id)
        res.sendStatus(204)
    }

}