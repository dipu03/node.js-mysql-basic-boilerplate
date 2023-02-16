const dotenv = require('dotenv')
const path = require('path')
const Joi = require('joi')


dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
        PORT: Joi.number().default(3000),

        CENTRAL_MYSQL_HOST: Joi.string().required().description('Central Mysql Host'),
        CENTRAL_MYSQL_USER: Joi.string().required().description('Central Mysql User'),
        ////CENTRAL_MYSQL_PASSWORD: Joi.string().required().description('Central Mysql Password'),
        CENTRAL_MYSQL_DB: Joi.string().required().description('Central Mysql DB'),
        CENTRAL_MYSQL_PORT: Joi.string().required().description('Central Port'),

        // SHOP_MYSQL_HOST: Joi.string().required().description('Shop Mysql Host'),
        // SHOP_MYSQL_USER: Joi.string().required().description('Shop Mysql User'),
        // SHOP_MYSQL_PASSWORD: Joi.string().required().description('Shop Mysql Password'),
        // SHOP_MYSQL_DB: Joi.string().required().description('Shop Mysql DB'),
        // SHOP_MYSQL_PORT: Joi.string().required().description('Shop Port'),

        // MONGODB_URL: Joi.string().required().description('Mongo DB url'),

        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description('minutes after which reset password token expires'),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description('minutes after which verify email token expires'),
        SMTP_HOST: Joi.string().description('server that will send the emails'),
        SMTP_PORT: Joi.number().description('port to connect to the email server'),
        SMTP_USERNAME: Joi.string().description('username for email server'),
        SMTP_PASSWORD: Joi.string().description('password for email server'),
        EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);


if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    databases: {
        central: {
            db: envVars.CENTRAL_MYSQL_DB,
            port: envVars.CENTRAL_MYSQL_PORT,
            host: envVars.CENTRAL_MYSQL_HOST,
            user: envVars.CENTRAL_MYSQL_USER,
            passwd: envVars.CENTRAL_MYSQL_PASSWORD
        },
        shop: {
            db: envVars.SHOP_MYSQL_DB,
            host: envVars.SHOP_MYSQL_HOST,
            port: envVars.SHOP_MYSQL_PORT,
            user: envVars.SHOP_MYSQL_USER,
            passwd: envVars.SHOP_MYSQL_PASSWORD
        },
        cerc: {
            db: envVars.CERC_POSTGRES_DB,
            host: envVars.CERC_POSTGRES_HOST,
            port: envVars.CERC_POSTGRES_PORT,
            user: envVars.CERC_POSTGRES_USER,
            passwd: envVars.CERC_POSTGRES_PASSWORD
        }
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
    email: {
        smtp: {
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            secure: false,
            requireTLS: true,
            auth: {
                user: envVars.SMTP_USERNAME,
                pass: envVars.SMTP_PASSWORD,
            },
        },
        from: envVars.EMAIL_FROM,
    },
    accessDomains: envVars.ACCESSDOMAINS,
    defaultLimit: 15,
};
