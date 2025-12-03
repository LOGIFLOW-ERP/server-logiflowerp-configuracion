import { inject, injectable } from 'inversify';
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import {
    InternalServerException,
    UnauthorizedException
} from '@Config/exception';
import { SHARED_TYPES } from '../IoC/types';
import { AdapterToken } from './Token';
import * as cookie from 'cookie'
import {
    AuthUserDTO,
    collections,
    TokenPayloadDTO,
    UserENTITY,
    WarehouseExitENTITY
} from 'logiflowerp-sdk';
import { MongoRepository } from '../Repositories';

@injectable()
export class AdapterSocket {
    private io!: Server;

    constructor(
        @inject(SHARED_TYPES.AdapterToken) private readonly adapterToken: AdapterToken
    ) { }

    initialize(httpServer: HttpServer) {
        this.io = new Server(httpServer, {
            cors: {
                // origin: '*', // ⚠️ mejor especificar dominio si usas cookies
                origin: [
                    'http://localhost:8080', // ⚠️ ajusta tus orígenes
                    'https://tufrontend.com',
                ],
                credentials: true,
            },
        });

        console.log('\x1b[36m%s\x1b[0m', '>>> Servidor WebSocket iniciado correctamente');

        // 🔐 Middleware de autenticación
        this.io.use(async (socket, next) => {
            try {
                const cookiesHeader = socket.handshake.headers.cookie;
                if (!cookiesHeader) throw new UnauthorizedException('No cookie header found');

                const cookies = cookie.parse(cookiesHeader);
                const token = cookies.authToken;
                if (!token) throw new UnauthorizedException('No authToken provided');

                // Verificar token y obtener payload (TokenPayloadDTO)
                const payload = (await this.adapterToken.verify(token));
                if (!payload) throw new UnauthorizedException('Invalid or expired token');

                // Guardar info del usuario autenticado
                const user = payload.user;
                socket.data.user = user;
                socket.data.payload = payload;

                // 🔹 unir el socket a una sala única del usuario
                socket.join(`user:${payload.rootCompany.code}:${user._id}`)

                next()
            } catch (err) {
                console.error('❌ Socket auth error:', err)
                next(new UnauthorizedException('Invalid socket authentication'))
            }
        })

        // Evento de conexión
        this.io.on('connection', (socket: Socket) => {
            const user = socket.data.user as AuthUserDTO
            const payload = socket.data.payload as TokenPayloadDTO
            console.log(`🟢 Cliente conectado: ${socket.id}`);
            console.log(`👤 Usuario autenticado: ${user.identity} (${user.email})`);

            socket.on('disconnect', () => {
                console.log(`🔴 Usuario desconectado: ${user.identity}`);
            })

            socket.on('warehouseExit:requestTechApproval', async ({ document }: { document: WarehouseExitENTITY }) => {
                const carrier = await this.getUserByIdentity(document.carrier.identity, payload.rootCompany.code, user)
                console.log(carrier)
                this.io
                    .to(`user:${payload.rootCompany.code}:${carrier._id}`)
                    .emit('warehouseExit:techApprovalRequest', {
                        document,
                        requesterId: user._id
                    })
            })
            socket.on('warehouseExit:techApprovalSubmit', ({ approved, document, requesterId }) => {
                this.io
                    .to(`user:${payload.rootCompany.code}:${requesterId}`)
                    .emit('warehouseExit:techApprovalResult', {
                        document,
                        approved
                    })
            })
        })
    }

    getIO() {
        if (!this.io) {
            throw new InternalServerException('Socket.IO no ha sido inicializado.');
        }
        return this.io;
    }

    private getUserByIdentity(identity: string, rootCompanyCode: string, user: AuthUserDTO) {
        const pipeline = [{ $match: { identity } }]
        const repository = new MongoRepository<UserENTITY>(rootCompanyCode, collections.user, user)
        return repository.selectOne(pipeline)
    }
}
