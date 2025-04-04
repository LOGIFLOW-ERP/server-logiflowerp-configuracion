import { IMapTransaction } from '@Shared/Domain'
import * as Express from 'express'
import { interfaces } from 'inversify'
import { AuthUserDTO, CompanyUserDTO, TokenPayloadDTO } from 'logiflowerp-sdk'
import { Document, Filter, OptionalUnlessRequiredId, UpdateFilter } from 'mongodb'

declare global {
    namespace Express {
        interface Request {
            payloadToken: TokenPayloadDTO
            user: AuthUserDTO
            userRoot: boolean
            company: CompanyUserDTO
            useCase: any
        }
    }

    interface ParamsPut {
        _id: string
    }
    interface ParamsDelete {
        _id: string
    }
    class ITransaction<T extends Document> {
        collection: string
        transaction: keyof IMapTransaction
        doc?: OptionalUnlessRequiredId<T>
        filter?: Filter<T>
        update?: T[] | UpdateFilter<T>
    }
}