import {
    Application,
    json,
    NextFunction,
    Request,
    Response,
    text,
    urlencoded
} from 'express'
import cookieParser from 'cookie-parser'
import { env } from './env'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import { BadRequestException } from './exception'
import crypto from 'crypto'
import { auth, convertDatesMiddleware, customLogger, resolveTenantBySubdomain } from '../Middlewares'

const ALGORITHM = 'aes-256-cbc'
const SECRET_KEY = Buffer.from(env.ENCRYPTION_KEY, 'utf8')
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

    if (env.REQUIRE_ENCRYPTION) {
        app.use(decryptMiddleware)
        app.use(encryptResponse)
    }

    app.use(convertDatesMiddleware)

}

function decryptMiddleware(req: Request, _res: Response, next: NextFunction) {
    try {
        const { iv, encryptedData } = req.body
        if (iv === undefined || encryptedData === undefined) {
            throw new BadRequestException('Datos inválidos: IV o datos cifrados faltantes')
        }
        req.body = decryptData(iv, encryptedData)
        next()
    } catch (error) {
        next(new BadRequestException(`No se pudo descifrar la data: ${(error as Error).message}`))
    }
}

function encryptResponse(_req: Request, res: Response, next: NextFunction) {
    const oldSend = res.send
    res.send = function (data) {
        try {
            data = encryptData(data)
            return oldSend.call(res, data)
        } catch (error) {
            return oldSend.call(res, { error: 'Error al encriptar la respuesta' })
        }
    }
    next()
}

function encryptData(data: any) {
    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv)
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return JSON.stringify({
        iv: iv.toString('hex'),
        encryptedData: encrypted,
    })
}

function decryptData(iv: string, encryptedData: string) {
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, Buffer.from(iv, 'hex'))

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    try {
        return JSON.parse(decrypted)
    } catch (parseError) {
        throw new BadRequestException('Datos descifrados no son un JSON válido')
    }
}
