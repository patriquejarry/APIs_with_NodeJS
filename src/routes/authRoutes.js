/**
 * npm i jsonwebtoken
 */
const BaseRoute = require('./baseRoute')
const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const Jwt = require('jsonwebtoken')

const PasswordHelper = require('../helpers/passwordHelper')

const failAction = (request, headers, erro) => {
    throw erro;
}

const USER = {
    username: 'Xuxadasilva',
    password: '123'
}

class AuthRoute extends BaseRoute {

    constructor(secret, db) {
        super()
        this.secret = secret
        this.db = db
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false, // desativa a autenticacao
                tags: ['api'],
                description: 'Obter token',
                notes: 'Faz login com user e senha do banco',
                validate: {
                    failAction,
                    payload: Joi.object({
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    })
                }
            },
            handler: async (request) => {
                const { username, password } = request.payload;
                // console.log('username', username)
                // console.log('password', password)
                const [usuario] = await this.db.read({
                    //username: username.toLowerCase()
                    username
                })
                // console.log('usuario', usuario)

                if (!usuario) {
                    return Boom.unauthorized();
                }
                const match = await PasswordHelper.comparePassword(password, usuario.password)
                // console.log('match', match)
                if (!match) {
                    return Boom.unauthorized('Usuario e senha invalidos!');
                }
                // if (username.toLowerCase() !== USER.username.toLowerCase() || password !== USER.password) {
                //     return Boom.unauthorized();
                // }
                const token = Jwt.sign({
                    username: username,
                    id: usuario.id
                }, this.secret);

                return { token }
            }
        }
    }
}

module.exports = AuthRoute