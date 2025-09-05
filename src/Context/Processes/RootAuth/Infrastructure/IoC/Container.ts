import { ContainerModule } from 'inversify';
import { AUTH_TYPES } from './types';
import {
    UseCaseChangePassword,
    UseCaseCheckTenant,
    UseCaseGetRootCompany,
    UseCaseGetRootSystemOption,
    UseCaseGetToken,
    UseCaseRequestPasswordReset,
    UseCaseResendMailRegisterUser,
    UseCaseResetPassword,
    UseCaseSignIn,
    UseCaseSignUp,
    UseCaseVerifyEmail
} from '../../Application';

export const containerModule = new ContainerModule(bind => {
    bind(AUTH_TYPES.UseCaseSignUp).to(UseCaseSignUp)
    bind(AUTH_TYPES.UseCaseVerifyEmail).to(UseCaseVerifyEmail)
    bind(AUTH_TYPES.UseCaseRequestPasswordReset).to(UseCaseRequestPasswordReset)
    bind(AUTH_TYPES.UseCaseResetPassword).to(UseCaseResetPassword)
    bind(AUTH_TYPES.UseCaseGetToken).to(UseCaseGetToken)
    bind(AUTH_TYPES.UseCaseSignIn).to(UseCaseSignIn)
    bind(AUTH_TYPES.UseCaseGetRootCompany).to(UseCaseGetRootCompany)
    bind(AUTH_TYPES.UseCaseGetRootSystemOption).to(UseCaseGetRootSystemOption)
    bind(AUTH_TYPES.UseCaseChangePassword).to(UseCaseChangePassword)
    bind(AUTH_TYPES.UseCaseResendMailRegisterUser).to(UseCaseResendMailRegisterUser)
    bind(AUTH_TYPES.UseCaseCheckTenant).to(UseCaseCheckTenant)
})