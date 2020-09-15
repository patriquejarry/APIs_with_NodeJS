const assert = require('assert');

const Postgres = require('../db/strategies/postgres/postgres');
const HeroesSchema = require('../db/strategies/postgres/schemas/heroesSchema');
const Context = require('../db/strategies/contextStrategy');

let context = null;

const MOCK_HERO_CREATE = {
    name: 'Black Hawk',
    power: 'Arrows'
};

const MOCK_HERO_UPDATE_BEFORE = {
    name: 'Robin',
    power: 'No really'
};

const MOCK_HERO_UPDATE_AFTER = {
    name: 'Batman',
    power: 'Money'
};

describe('Test Suite for Postgres Strategy', function () {

    this.timeout(Infinity);
    this.beforeAll(async () => {

        const cnx = Postgres.connect();
        const schema = cnx.define(HeroesSchema.name, HeroesSchema.schema, HeroesSchema.options);
        await schema.sync();
        context = new Context(new Postgres(cnx, schema));

        // Cleaning
        await context.delete(MOCK_HERO_CREATE);
        await context.delete(MOCK_HERO_UPDATE_BEFORE);
        await context.delete(MOCK_HERO_UPDATE_AFTER);
    });

    it('PostgresSQL Connection', async () => {
        const result = await context.isConnected();
        assert.equal(result, true);
    });

    it('Create', async () => {
        const result = await context.create(MOCK_HERO_CREATE);
        delete result.id;
        assert.deepEqual(result, MOCK_HERO_CREATE);
    });

    it('Read', async () => {
        const [result] = await context.read({ name: MOCK_HERO_CREATE.name });
        delete result.id;
        assert.deepEqual(result, MOCK_HERO_CREATE);
    });

    it('Update', async () => {
        const result = await context.create(MOCK_HERO_UPDATE_BEFORE);
        const mock_id = result.id;
        delete result.id;
        assert.deepEqual(result, MOCK_HERO_UPDATE_BEFORE);

        const result1 = await context.update({ id: mock_id }, MOCK_HERO_UPDATE_AFTER);
        assert.equal(result1, 1);

        const [result2] = await context.read({ id: mock_id });
        delete result2.id;
        assert.deepEqual(result2, MOCK_HERO_UPDATE_AFTER);
    });

    it('Remove', async () => {
        const result1 = await context.delete(MOCK_HERO_CREATE);
        assert.equal(result1, 1);

        const result2 = await context.read({ name: MOCK_HERO_CREATE.name });
        assert.equal(result2.length, 0);
    });

});