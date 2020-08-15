const assert = require('assert');

const MongoDB = require('../db/strategies/mongodb/mongodb');
const HeroesModel = require('../db/strategies/mongodb/schemas/heroesModel')
const Context = require('../db/strategies/contextStrategy');

let context = null;

const MOCK_HERO_CREATE = {
    name: 'Black Hawk',
    power: 'Arrows'
};

const MOCK_HERO_UPDATE_BEFORE = {
    name: `Robin-${Date.now()}`,
    power: 'No really'
};

const MOCK_HERO_UPDATE_AFTER = {
    name: `Batman-${Date.now()}`,
    power: 'Money'
};

describe('Test Suite for MongoDB Strategy', function () {

    this.timeout(Infinity);
    this.beforeAll(async () => {
        const connection = await MongoDB.connect();
        context = new Context(new MongoDB(connection, HeroesModel));
    });

    it('MongoDB Connection', async () => {
        const result = await context.isConnected();
        assert.equal(result, 1);
    });

    it('Create', async () => {
        const { name, power } = await context.create(MOCK_HERO_CREATE);
        assert.deepEqual({ name, power }, MOCK_HERO_CREATE);
    });

    it('Read', async () => {
        const [{ name, power }] = await context.read({ name: MOCK_HERO_CREATE.name });
        assert.deepEqual({ name, power }, MOCK_HERO_CREATE);
    });

    it('Update', async () => {
        // By Id

        // By Object
        const { name, power } = await context.create(MOCK_HERO_UPDATE_BEFORE);
        assert.deepEqual({ name, power }, MOCK_HERO_UPDATE_BEFORE);

        const { nModified } = await context.update({ name, power }, MOCK_HERO_UPDATE_AFTER);
        assert.equal(nModified, 1);

        const [{ name: name2, power: power2 }] = await context.read({ name: MOCK_HERO_UPDATE_AFTER.name });
        assert.deepEqual({ name: name2, power: power2 }, MOCK_HERO_UPDATE_AFTER);
    });

    it('Remover', async () => {
        const { deletedCount } = await context.delete(MOCK_HERO_CREATE);
        assert.equal(deletedCount, 1);
        const result = await context.read({ name: MOCK_HERO_CREATE.name });
        assert.equal(result.length, 0);
    });

});