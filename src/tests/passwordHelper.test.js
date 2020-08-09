const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')


const SENHA = 'Erick@32323232'
const HASH = '$2b$04$XVINKYqlhTt/jBfbUtE7zeFe7NJhA7H0BNVepZmyThq.l.N2c2xwu'

describe('UserHelper test suite', function () {

    it('Deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)
        // console.log('result', result)
        assert.ok(result.length > 10)
    })

    it('Deve comparar uma senha e seu hash', async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH)
        // console.log('result', result)
        assert.ok(result)
    })
})