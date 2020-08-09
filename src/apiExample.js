/**
 * npm i hapi
 */

const Hapi = require('hapi')
const Context = require('./db/strategies/contextStrategy')
const Mongodb = require('./db/strategies/mongodb/mongodb')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema')

const app = Hapi.Server({
    port: 5000
})

async function main() {

    const connection = Mongodb.connect();
    const context = new Context(new Mongodb(connection, HeroiSchema))

    await app.register({
        plugin: require('hapi-response-utilities')
    })

    app.route({
        path: '/herois',
        method: 'GET',
        handler: async (request, head) => {
            const result = await context.read()
            return head
                .response(result)
                .header('content-type', 'application/json')
        }
    })

    await app.start()
    console.log(`Servidor rodando na porta ${app.info.port}`)

}
main()