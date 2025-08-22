import { env } from '@Config/env'
import { BadRequestException, NotFoundException } from '@Config/exception'
import { MongoRepository } from '@Shared/Infrastructure'
import { NextFunction, Request, Response } from 'express'
import {
    AuthUserDTO,
    collections,
    db_default,
    db_root,
    getEmpresa,
    RootCompanyENTITY,
    State
} from 'logiflowerp-sdk'

export async function resolveTenantBySubdomain(req: Request, _res: Response, next: NextFunction) {
    const subdomain = env.NODE_ENV === 'development'
        ? db_default
        : getEmpresa(req.headers.origin)
    if (!subdomain) {
        return next(new BadRequestException('Subdominio no encontrado'))
    }
    const tenant = subdomain.toUpperCase()

    const repository = new MongoRepository<RootCompanyENTITY>(db_root, collections.company, new AuthUserDTO())
    const pipeline = [{ $match: { code: tenant, state: State.ACTIVO, isDeleted: false } }]
    const rootCompany = await repository.queryMongoWithRedisMemo(pipeline)

    if (rootCompany.length !== 1) {
        return next(new NotFoundException('Subdominio no válido'))
    }

    req.tenant = tenant
    next()
}