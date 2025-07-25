export const AUTH_TYPES = {
    UseCaseSignUp: Symbol.for(`${__dirname}UseCaseSignUp`),
    UseCaseVerifyEmail: Symbol.for(`${__dirname}UseCaseVerifyEmail`),
    UseCaseRequestPasswordReset: Symbol.for(`${__dirname}UseCaseRequestPasswordReset`),
    UseCaseResetPassword: Symbol.for(`${__dirname}UseCaseResetPassword`),
    UseCaseGetToken: Symbol.for(`${__dirname}UseCaseGetToken`),
    UseCaseSignIn: Symbol.for(`${__dirname}UseCaseSignIn`),
    UseCaseGetRootCompany: Symbol.for(`${__dirname}UseCaseGetRootCompany`),
    UseCaseGetRootSystemOption: Symbol.for(`${__dirname}UseCaseGetRootSystemOption`),
    UseCaseGetPersonnel: Symbol.for(`${__dirname}UseCaseGetPersonnel`),
    UseCaseGetProfile: Symbol.for(`${__dirname}UseCaseGetPersonnel`),
    UseCaseChangePassword: Symbol.for(`${__dirname}UseCaseChangePassword`),
    UseCaseResendMailRegisterUser: Symbol.for(`${__dirname}UseCaseResendMailRegisterUser`),
}