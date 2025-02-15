import { get } from 'env-var'

export const env = {
    PREFIX: get('PREFIX').required().asString(),
    PORT: get('PORT').required().asPortNumber(),
    DOMAINS: get('DOMAINS').required().asArray(),
    NODE_ENV: get('NODE_ENV').required().asEnum(['development', 'qa', 'production']),
    MONGO_URI: get('MONGO_URI').required().asUrlString(),
    REDIS_URL: get('REDIS_URL').required().asUrlString(),
    JWT_KEY: get('JWT_KEY').required().asString(),
    ENCRYPTION_KEY: get('ENCRYPTION_KEY').required().asString(),
    REQUIRE_ENCRYPTION: get('REQUIRE_ENCRYPTION').required().asBool(),
    REQUIRE_AUTH: get('REQUIRE_AUTH').required().asBool(),
    EMAIL_USER: get('EMAIL_USER').required().asEmailString(),
    EMAIL_PASS: get('EMAIL_PASS').required().asString(),
    SMTP_HOST: get('SMTP_HOST').required().asString(),
    SMTP_PORT: get('SMTP_PORT').required().asInt(),
    SMTP_SECURE: get('SMTP_SECURE').required().asBool(),
}