/**
 * npm i hapi
 * npm i @hapi/hapi
 * npm i vision inert hapi-swagger
 * npm i @hapi/vision @hapi/inert hapi-swagger
 * npm i hapi-auth-jwt2
 * npm i bcrypt
 * npm i dotenv
 */

// Config injection
const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert');
const env = process.env.NODE_ENV || "dev";
ok(env === "dev" || env === "prod", "A env é inválida, ou dev ou prod")
const configPath = join(__dirname, '../config', `.env.${env}`)
// console.log('configPath', configPath)
config({ path: configPath })

//const Hapi = require('hapi')
const Hapi = require('@hapi/hapi');
const Context = require('./db/strategies/contextStrategy')
const Mongodb = require('./db/strategies/mongodb/mongodb')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema')
const HeroisRoute = require('./routes/heroisRoute')
const AuthRoute = require('./routes/authRoutes')
const UtilRoutes = require('./routes/utilRoutes')

const Postgres = require('./db/strategies/postgres/postgres')
const UsuarioSchema = require('./db/strategies/postgres/schemas/usuarioSchemas')

const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const HapiJwt = require('hapi-auth-jwt2')

// const JWT_SECRET = 'MEU_SEGREDO_123';
const JWT_SECRET = process.env.JWT_SECRET;


const app = Hapi.Server({
    // port: 5000
    port: process.env.PORT
})

function mapRoutes(instance, methods) {
    // console.log('methods', methods)
    return methods.map(method => instance[method]())
}

async function main() {

    const connection = Mongodb.connect();
    const context = new Context(new Mongodb(connection, HeroiSchema))

    const connectionPostgres = await Postgres.connect()
    const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
    const contextPostgres = new Context(new Postgres(connectionPostgres, model))

    const swaggerOptions = {
        info: {
            title: 'API Herois - #CursoNodeBR',
            version: 'v1.0'
        }
    }

    await app.register([
        HapiJwt,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    // Define uma estrategia de autenticacao com nome 'jwt'
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        options: {
            expiresIn: 20
        },
        validate: async (dado, request) => {
            //verifica no BDD se usuario continua ativo e pagando
            const [result] = await contextPostgres.read({
                username: dado.username
            })
            if (!result) {
                return {
                    isValid: false
                }
            }

            return {
                isValid: true
            }
        }
    })

    // Diz que a estrategia default é a jwt criada acima
    app.auth.default('jwt')

    app.route([
        ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostgres), AuthRoute.methods()),
        ...mapRoutes(new HeroisRoute(context), HeroisRoute.methods()),
        ...mapRoutes(new UtilRoutes(), UtilRoutes.methods())
    ])

    await app.start()
    console.log(`Servidor rodando na porta ${app.info.port}`)

    return app

}
module.exports = main()