const assert = require('assert');

const api = require('../api');
const Context = require('../db/strategies/contextStrategy');
const Postgres = require('../db/strategies/postgres/postgres');
const UsersSchema = require('../db/strategies/postgres/schemas/usersSchema');

const USER = {
    name: 'Xuxadasilva',
    password: '123'
};
const USER_DB = {
    ...USER,
    password: '$2b$04$k4fc.GsUSKj56TpPXGVe4.2XmZTlstEWPqz9TxryJAYjCEyH4RFgG'
};
const USER_NOT_KNOWN = {
    name: 'wasnt_me',
    password: '123'
};

let ctxUsers = null;
let app = {};

describe('Test Suite for AUTH Heroes', function () {

    this.beforeAll(async () => {

        app = await api;

        const cnxPostgres = await Postgres.connect();
        const modelUsers = await Postgres.defineModel(cnxPostgres, UsersSchema);
        ctxUsers = new Context(new Postgres(cnxPostgres, modelUsers));

        // Update password
        const result = await ctxUsers.update(null, USER_DB, true);
    });

    it('Create a token POST /login', async () => {

        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        });

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.equal(statusCode, 200);
        assert.ok(dados.token.length > 10);
    })

    it('Must return unauthorized for a wrong logon', async () => {

        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER_NOT_KNOWN
        });

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.equal(statusCode, 401);
        assert.ok(dados.error, "Unauthorized");
    });

});