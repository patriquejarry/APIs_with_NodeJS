// External imports
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const HapiJwt = require('hapi-auth-jwt2')
const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert');

// Configuration
const env = process.env.NODE_ENV || "dev";
ok(env === "dev" || env === "production", "The 'env' is invalid, [dev | production]");
const configPath = join(__dirname, '../config', `.env.${env}`);
config({ path: configPath });

// Internal imports
const Context = require('./db/strategies/contextStrategy')

const Mongodb = require('./db/strategies/mongodb/mongodb')
const HeroesModel = require('./db/strategies/mongodb/schemas/heroesModel')

const Postgres = require('./db/strategies/postgres/postgres')
const UsersSchema = require('./db/strategies/postgres/schemas/usersSchema')

const HeroesRoutes = require('./routes/heroesRoutes')
const AuthRoutes = require('./routes/authRoutes')
const UtilRoutes = require('./routes/utilRoutes')

// Constants
const JWT_SECRET = process.env.JWT_SECRET;

// Server
const app = Hapi.Server({
    port: process.env.PORT || 5000
});

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]());
};

async function main() {

    const cnxMongodb = Mongodb.connect();
    const ctxMongodbHeroes = new Context(new Mongodb(cnxMongodb, HeroesModel));

    const cnxPostgres = await Postgres.connect();
    const modelPostgresUsers = await Postgres.defineModel(cnxPostgres, UsersSchema);
    const cxtPostgresUsers = new Context(new Postgres(cnxPostgres, modelPostgresUsers));

    const swaggerOptions = {
        info: {
            title: 'API Heroes - #NodeBR',
            version: 'v1.0'
        }
    };

    await app.register([
        HapiJwt,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    // Define a strategy for authentication named 'jwt'
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        options: {
            expiresIn: 20
        },
        validate: async (dado, request) => {

            const [result] = await cxtPostgresUsers.read({
                name: dado.name
            });

            /**
             * Here validate user
             * If valid, not expired, the payments is ok, ... 
             */

            return {
                isValid: !!result
            };
        }
    });

    // Define the strategy default, this one created above
    app.auth.default('jwt');

    app.route([
        ...mapRoutes(new AuthRoutes(JWT_SECRET, cxtPostgresUsers), AuthRoutes.methods()),
        ...mapRoutes(new HeroesRoutes(ctxMongodbHeroes), HeroesRoutes.methods()),
        ...mapRoutes(new UtilRoutes(), UtilRoutes.methods())
    ]);

    await app.start();
    console.log(`Server running on port ${app.info.port}`);

    return app;

}
module.exports = main();