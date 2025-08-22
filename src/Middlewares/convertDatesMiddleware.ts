import { NextFunction, Request, Response } from 'express'
import { convertDates } from 'logiflowerp-sdk'

export function convertDatesMiddleware(req: Request, _res: Response, next: NextFunction) {
    convertDates(req.body)
    next()
}