/*
    npm i --save-dev mocha
*/

const assert = require('assert');
const MongoDB = require('../db/strategies/mongodb/mongodb');
const HeroiSchema = require('../db/strategies/mongodb/schemas/heroisSchema')
const Context = require('../db/strategies/contextStrategy');

//const context = new Context(new MongoDB());
let context = null;

const MOCK_HEROI_CADASTRAR = {
    nome: 'Gaviao Negrao',
    poder: 'Flechas'
};

const MOCK_HEROI_ATUALIZAR_ANTES = {
    nome: `Robin-${Date.now()}`,
    poder: 'Nada'
};

const MOCK_HEROI_ATUALIZAR_DEPOIS = {
    nome: `Batman-${Date.now()}`,
    poder: 'Dinheiro'
};

describe('MongoDB Strategy', function () {

    this.timeout(Infinity);
    this.beforeAll(async () => {
        const connection = await MongoDB.connect();
        // console.log('connection', connection)
        context = new Context(new MongoDB(connection, HeroiSchema));
    });

    it('MongoDB Connection', async () => {
        const result = await context.isConnected();
        // console.log('result', result)
        assert.equal(result, 1);
    });

    it('Cadastrar', async () => {
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR);
        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR);
    });

    it('Listar', async () => {
        const [{ nome, poder }] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR);
    });

    it('Atualizar', async () => {
        // Por Id

        // Por objeto
        const { nome, poder } = await context.create(MOCK_HEROI_ATUALIZAR_ANTES);
        assert.deepEqual({ nome, poder }, MOCK_HEROI_ATUALIZAR_ANTES);

        const { nModified } = await context.update({ nome, poder }, MOCK_HEROI_ATUALIZAR_DEPOIS);
        assert.equal(nModified, 1);
        const [{ nome: nome2, poder: poder2 }] = await context.read({ nome: MOCK_HEROI_ATUALIZAR_DEPOIS.nome });
        assert.deepEqual({ nome: nome2, poder: poder2 }, MOCK_HEROI_ATUALIZAR_DEPOIS);

    });

    it('Remover', async () => {
        const { deletedCount } = await context.delete(MOCK_HEROI_CADASTRAR);
        assert.equal(deletedCount, 1);
        const result2 = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
        assert.equal(result2.length, 0);
    });

});