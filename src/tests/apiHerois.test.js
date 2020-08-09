const assert = require('assert')
const api = require('./../api')

let app = {}

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ilh1eGFkYXNpbHZhIiwiaWQiOjEsImlhdCI6MTU5Njg3OTEyMH0.bX8h2dq5j4DJ_mVthA0U80MaQgpgkv8qbUdQh4AQ6io'
const headers = {
    Authorization: TOKEN
}
const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
}
const MOCK_HEROI_INICIAL = {
    nome: 'Gaviao Negro',
    poder: 'A Mira'
}
let MOCK_ID = ''

describe('Suite de tests da API Heroes', function () {

    this.timeout(10000);
    this.beforeAll(async () => {
        app = await api

        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            headers,
            payload: JSON.stringify(MOCK_HEROI_INICIAL)
        })

        const dados = JSON.parse(result.payload)
        MOCK_ID = dados._id

    })

    it('listar /herois', async () => {

        const result = await app.inject({
            method: 'GET',
            url: '/herois',
            headers
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.equal(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('listar /herois - deve retornar os 10 primeiros', async () => {

        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=2&nome=${MOCK_HEROI_INICIAL.nome}`,
            headers
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.equal(statusCode, 200)
        assert.ok(Array.isArray(dados))
        assert.ok(dados.length >= 1)
    })

    it('Cadastrar POST /herois', async () => {

        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            headers,
            payload: JSON.stringify(MOCK_HEROI_CADASTRAR)
        })

        //console.log('result', result)
        const statusCode = result.statusCode
        const { _id, message } = JSON.parse(result.payload)

        assert.equal(statusCode, 200)
        assert.notStrictEqual(_id, undefined)
        assert.equal(message, 'Heroi cadastrado com sucesso!')
    })

    it('Cadastrar PATCH /herois/{id}', async () => {
        const MOCK_HEROI_PODER_FINAL = {
            poder: 'Super Mira'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${MOCK_ID}`,
            headers,
            payload: JSON.stringify(MOCK_HEROI_PODER_FINAL)
        })

        // console.log('result', result)
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.equal(statusCode, 200)
        assert.equal(dados.message, 'Heroi atualizado com sucesso!')
        // assert.equal(result._id, MOCK_ID)
        // assert.deepEqual(result, MOCK_HEROI_ATUALIZAR_INICIAL)
    })

    it('Cadastrar DELETE /herois/{id}', async () => {

        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${MOCK_ID}`,
            headers
        })

        // console.log('result', result)
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.equal(statusCode, 200)
        assert.equal(dados.message, 'Heroi removido com sucesso!')
        // assert.equal(result._id, MOCK_ID)
    })

})