import { NextFunction, Request, Response } from 'express';

export function customLogger(req: Request, res: Response, next: NextFunction) {

    const start = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - start
        const status = res.statusCode;

        let color = '\x1b[32m%s\x1b[0m'
        if (status >= 400 && status < 500) color = '\x1b[33m%s\x1b[0m'
        if (status >= 500) color = '\x1b[31m%s\x1b[0m'

        console.log(color, `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`)
    })

    next()

}