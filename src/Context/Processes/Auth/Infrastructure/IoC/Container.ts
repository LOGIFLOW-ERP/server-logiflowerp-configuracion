import { ContainerModule } from 'inversify'
import { AUTH_TYPES } from './types'
import { UseCaseSignUp } from '../../Application'

export const containerModule = new ContainerModule(bind => {
    bind(AUTH_TYPES.UseCaseSignUp).to(UseCaseSignUp)
})