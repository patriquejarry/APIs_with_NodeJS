/*
    npm i --save-dev mocha
*/

const assert = require('assert');
const Postgres = require('./../db/strategies/postgres/postgres');
const HeroiSchema = require('./../db/strategies/postgres/schemas/heroiSchemas');
const Context = require('./../db/strategies/contextStrategy');

// const context = new Context(new Postgres());
let context = null;

const MOCK_HEROI_CADASTRAR = {
    nome: 'Gaviao Negro',
    poder: 'Flechas'
};

const MOCK_HEROI_ATUALIZAR_ANTES = {
    nome: 'Robin',
    poder: 'Nada'
};

const MOCK_HEROI_ATUALIZAR_DEPOIS = {
    nome: 'Batman',
    poder: 'Dinheiro'
};

describe('Postgres Strategy', function () {

    this.timeout(Infinity);
    this.beforeAll(async () => {
        const connection = Postgres.connect();
        const schema = connection.define(HeroiSchema.name, HeroiSchema.schema, HeroiSchema.options);
        await schema.sync();
        context = new Context(new Postgres(connection, schema));
    });

    it('PostgresSQL Connection', async () => {
        const result = await context.isConnected();
        assert.equal(result, true);
    });

    it('Cadstrar', async () => {
        const result = await context.create(MOCK_HEROI_CADASTRAR);
        delete result.id;
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
    });

    it('Listar', async () => {
        const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
        delete result.id;
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
    });

    it('Atualizar', async () => {
        // Por Id
        // const result1 = await context.update(1, MOCK_HEROI_ATUALIZAR);
        // assert.equal(result1, 1);
        // const [result2] = await context.read({ nome: MOCK_HEROI_ATUALIZAR.nome });
        // delete result2.id;
        // assert.deepEqual(result2, MOCK_HEROI_ATUALIZAR);

        // Por objeto
        const result = await context.create(MOCK_HEROI_ATUALIZAR_ANTES);
        delete result.id;
        assert.deepEqual(result, MOCK_HEROI_ATUALIZAR_ANTES);

        const result1 = await context.update(result, MOCK_HEROI_ATUALIZAR_DEPOIS);
        assert.equal(result1, 1);
        const [result2] = await context.read({ nome: MOCK_HEROI_ATUALIZAR_DEPOIS.nome });
        delete result2.id;
        assert.deepEqual(result2, MOCK_HEROI_ATUALIZAR_DEPOIS);

    });

    it('Remover', async () => {
        const result1 = await context.delete(MOCK_HEROI_CADASTRAR);
        assert.equal(result1, 1);
        const result2 = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
        assert.equal(result2.length, 0);
    });

});