const BaseRoute = require('./baseRoute')
const Joi = require('@hapi/joi')
//const Boom = require('boom')
const Boom = require('@hapi/boom')

const failAction = (request, headers, erro) => {
    throw erro;
}

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

function makeOptions(method) {
    return {
        tags: ['api'],
        description: 'Minha description - ' + method,
        notes: 'Meus notes - ' + method
    }
}

class HeroisRoute extends BaseRoute {

    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            options: {
                // tags: ['api'],
                // description: 'Minha description - list',
                // notes: 'Meus notes - list',
                ...makeOptions('list'),
                validate: {
                    failAction,
                    headers,
                    // payload -> body
                    // head -> header
                    // params -> na URL :id
                    // query -> ?skip=0&limit=10
                    query: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    })
                }
            },
            handler: (request, head) => {
                try {
                    const { skip, limit, nome } = request.query;
                    let query = {}
                    if (nome) {
                        query.nome = { $regex: `.*${nome}.*` }
                    }

                    return this.db.read(query, skip, limit)

                } catch (err) {
                    console.log('DEU RUIM', err);
                    return Boom.internal('Deu ruim aqui')
                }
            }
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            options: {
                // tags: ['api'],
                // description: 'Minha description - create',
                // notes: 'Meus notes - create',
                ...makeOptions('create'),
                validate: {
                    failAction,
                    headers,
                    payload: Joi.object({
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(3).max(100)
                    })
                }
            },
            handler: async (request, head) => {
                try {
                    const { nome, poder } = request.payload
                    const result = await this.db.create({ nome, poder })

                    return {
                        message: 'Heroi cadastrado com sucesso!',
                        _id: result._id
                    }

                } catch (err) {
                    console.log('DEU RUIM', err);
                    return Boom.internal('Deu ruim aqui')
                }
            }
        }
    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            options: {
                // tags: ['api'],
                // description: 'Minha description - update',
                // notes: 'Meus notes - update',
                ...makeOptions('update'),
                validate: {
                    failAction,
                    headers,
                    params: Joi.object({
                        id: Joi.string().required()
                    }),
                    payload: Joi.object({
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(3).max(100)
                    })
                }
            },
            handler: async (request, head) => {
                try {
                    const { id } = request.params
                    const { payload } = request
                    const dados = JSON.parse(JSON.stringify(payload))
                    const result = await this.db.update({ _id: id }, dados)

                    let message = 'Heroi atualizado com sucesso!'
                    if (!result.nModified)
                        message = 'Nao foi possivel atualizar Heroi!'
                    else if (result.nModified > 1)
                        message = `Varios Herois atualizados(${result.nModified})!`

                    return {
                        message,
                        _id: result._id
                    }

                } catch (err) {
                    console.log('DEU RUIM', err);
                    return Boom.internal('Deu ruim aqui')
                }
            }
        }
    }

    delete() {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            options: {
                // tags: ['api'],
                // description: 'Minha description - delete',
                // notes: 'Meus notes - delete',
                ...makeOptions('delete'),
                validate: {
                    failAction,
                    headers,
                    params: Joi.object({
                        id: Joi.string().required()
                    })
                }
            },
            handler: async (request, head) => {
                try {
                    const { id } = request.params
                    const result = await this.db.delete({ _id: id })

                    let message = 'Heroi removido com sucesso!'
                    if (!result.n)
                        message = 'Nao foi possivel remover Heroi!'
                    else if (result.n > 1)
                        message = `Varios Herois removidos(${result.n})!`

                    return {
                        message,
                        _id: result._id
                    }

                } catch (err) {
                    console.log('DEU RUIM', err);
                    return Boom.internal('Deu ruim aqui')
                }
            }
        }
    }

}

module.exports = HeroisRoute