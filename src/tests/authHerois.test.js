const assert = require('assert')
const api = require('../api')
const Context = require('../db/strategies/contextStrategy')
const Postgres = require('../db/strategies/postgres/postgres')
const UsuarioSchema = require('../db/strategies/postgres/schemas/usuarioSchemas')

const USER = {
    username: 'Xuxadasilva',
    password: '123'
}

const USER_DB = {
    ...USER,
    password: '$2b$04$k4fc.GsUSKj56TpPXGVe4.2XmZTlstEWPqz9TxryJAYjCEyH4RFgG'
}

let context = null;
let app = {}

describe('authHerois test suite', function () {
    this.beforeAll(async () => {
        app = await api;

        const connectionPostgres = await Postgres.connect()
        const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
        context = new Context(new Postgres(connectionPostgres, model));
        const result = await context.update(null, USER_DB, true)
    })

    it('deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        })

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.equal(statusCode, 200);
        assert.ok(dados.token.length > 10);
    })

    it('deve retornar nao autorizado ao tentar um login errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'erickwendel',
                password: '123'
            }
        })

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.equal(statusCode, 401);
        assert.ok(dados.error, "Unauthorized");
    })

})