import {
    Application,
    json,
    text,
    urlencoded
} from 'express'
import cookieParser from 'cookie-parser'
import { env } from './env'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import { auth, convertDatesMiddleware, customLogger, resolveTenantBySubdomain } from '../Middlewares'

const allowedInProd = /^https?:\/\/([a-z0-9-]+\.)*logiflowerp\.com$/i

export async function serverConfig(app: Application, rootPath: string) {

    app.use(resolveTenantBySubdomain)
    app.use(customLogger)
    app.use(cookieParser())
    app.use(helmet())
    app.use(compression())

    app.disable('x-powered-by')

    app.use(cors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true)
            }
            if (env.NODE_ENV === 'production') {
                if (allowedInProd.test(origin)) {
                    return callback(null, true)
                }
            } else {
                if (
                    origin.startsWith('http://localhost') ||
                    allowedInProd.test(origin)
                ) {
                    return callback(null, true)
                }
            }
            callback(new Error('Not allowed by CORS'))
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }))

    auth(app, rootPath)

    app.use(json({ limit: '10mb' }))
    app.use(text({ limit: '10mb' }))
    app.use(urlencoded({ limit: '10mb', extended: true }))

    app.use(convertDatesMiddleware)

}
