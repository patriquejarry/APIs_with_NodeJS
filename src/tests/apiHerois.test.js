const assert = require('assert');

const api = require('../api');

let app = {};

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiWHV4YWRhc2lsdmEiLCJpZCI6MSwiaWF0IjoxNTk3NDMyOTc2fQ.Eg-_AkO12QkIuh0Qnz0yGg8SWFrCMCVTxA9fZgITn-g';
const headers = {
    Authorization: TOKEN
};
const MOCK_HERO_CREATE = {
    name: 'Wonder Woman',
    power: 'The Lasso of Truth'
};
const MOCK_HERO_INICIAL = {
    name: 'Black Hawk',
    power: 'The sight'
};
const MOCK_HERO_FINAL = {
    power: 'Super sight'
};
let MOCK_ID = '';

describe('Test Suite for API Heroes', function () {

    this.timeout(10000);
    this.beforeAll(async () => {

        app = await api;

        for (let v of [0, 1, 2]) {

            const hero = { ...MOCK_HERO_INICIAL };
            hero.name = hero.name + '-' + v;

            const result = await app.inject({
                method: 'POST',
                url: '/heroes',
                headers,
                payload: JSON.stringify(hero)
            });

            const dados = JSON.parse(result.payload);
            MOCK_ID = dados._id;
        }
    });

    it('Read GET /heroes', async () => {

        const result = await app.inject({
            method: 'GET',
            url: '/heroes',
            headers
        });

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.equal(statusCode, 200);
        assert.ok(Array.isArray(dados));
        assert.ok(dados.length > 2);
    });

    it('Read GET /heroes - Should return only 2', async () => {

        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=2&name=${MOCK_HERO_INICIAL.name}`,
            headers
        });

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.equal(statusCode, 200);
        assert.ok(Array.isArray(dados));
        assert.ok(dados.length === 2);
    })

    it('Create POST /heroes', async () => {

        const result = await app.inject({
            method: 'POST',
            url: '/heroes',
            headers,
            payload: JSON.stringify(MOCK_HERO_CREATE)
        });

        const statusCode = result.statusCode;
        const { _id, message } = JSON.parse(result.payload);

        assert.equal(statusCode, 200);
        assert.notStrictEqual(_id, undefined);
        assert.equal(message, 'Hero created with success !');
    });

    it('Update PATCH /heroes/{id}', async () => {
        const result = await app.inject({
            method: 'PATCH',
            url: `/heroes/${MOCK_ID}`,
            headers,
            payload: JSON.stringify(MOCK_HERO_FINAL)
        });

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.equal(statusCode, 200);
        assert.equal(dados.message, 'Hero updated with success !');
    });

    it('Remove DELETE /heroes/{id}', async () => {

        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${MOCK_ID}`,
            headers
        });

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.equal(statusCode, 200);
        assert.equal(dados.message, 'Hero removed with success !');
    });

})