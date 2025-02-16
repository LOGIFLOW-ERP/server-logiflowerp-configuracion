import { ContainerModule } from 'inversify'
import { AUTH_TYPES } from './types'
import {
    UseCaseSignIn,
    UseCaseSignUp,
    UseCaseVerifyEmail
} from '../../Application'

export const containerModule = new ContainerModule(bind => {
    bind(AUTH_TYPES.UseCaseSignUp).to(UseCaseSignUp)
    bind(AUTH_TYPES.UseCaseSignIn).to(UseCaseSignIn)
    bind(AUTH_TYPES.UseCaseVerifyEmail).to(UseCaseVerifyEmail)
})