const Hapi = require('@hapi/hapi');
const Config = require('./configs');

Config.initConfig();

const Context = require('../db/strategies/contextStrategy');
const Mongodb = require('../db/strategies/mongodb/mongodb');
const HeroesModel = require('../db/strategies/mongodb/schemas/heroesModel');

const app = Hapi.Server({
    port: process.env.PORT || 5000
});

async function main() {

    const connection = Mongodb.connect();
    const context = new Context(new Mongodb(connection, HeroesModel));

    // await app.register({
    //     plugin: require('hapi-response-utilities')
    // });

    app.route({
        path: '/heroes',
        method: 'GET',
        handler: async (request, head) => {
            const result = await context.read()
            return head
                .response(result)
                .header('content-type', 'application/json')
        }
    });

    await app.start();
    console.log(`Server running on port ${app.info.port}`);

};

main();
