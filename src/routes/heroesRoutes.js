const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');

const BaseRoutes = require('./baseRoutes');

const failAction = (request, headers, erro) => {
    throw erro;
};

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown();

function makeOptions(method) {
    return {
        tags: ['api'],
        description: 'My description - ' + method,
        notes: 'My notes - ' + method
    };
}

class HeroesRoutes extends BaseRoutes {

    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/heroes',
            method: 'GET',
            options: {
                ...makeOptions('list'),
                validate: {
                    failAction,
                    headers,
                    // payload -> body
                    // head -> header
                    // params -> in URL :id
                    // query -> ?skip=0&limit=10
                    query: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        name: Joi.string().min(3).max(100)
                    })
                }
            },
            handler: (request, head) => {
                try {
                    const { skip, limit, name } = request.query;
                    let query = {};
                    if (name) {
                        query.name = { $regex: `.*${name}.*` }
                    };
                    return this.db.read(query, skip, limit);

                } catch (err) {
                    console.log('Unknown error : list: ', err);
                    return Boom.internal('Unknown error : list');
                }
            }
        }
    }

    create() {
        return {
            path: '/heroes',
            method: 'POST',
            options: {
                ...makeOptions('create'),
                validate: {
                    failAction,
                    headers,
                    payload: Joi.object({
                        name: Joi.string().min(3).max(100),
                        power: Joi.string().min(3).max(100)
                    })
                }
            },
            handler: async (request, head) => {
                try {
                    const { name, power } = request.payload;
                    const result = await this.db.create({ name, power });

                    return {
                        message: 'Hero created with success !',
                        _id: result._id
                    };

                } catch (err) {
                    console.log('Unknown error : create : ', err);
                    return Boom.internal('Unknown error : create');
                }
            }
        }
    }

    update() {
        return {
            path: '/heroes/{id}',
            method: 'PATCH',
            options: {
                ...makeOptions('update'),
                validate: {
                    failAction,
                    headers,
                    params: Joi.object({
                        id: Joi.string().required()
                    }),
                    payload: Joi.object({
                        name: Joi.string().min(3).max(100),
                        power: Joi.string().min(3).max(100)
                    })
                }
            },
            handler: async (request, head) => {
                try {
                    const { id } = request.params;
                    const { payload } = request;
                    const dados = JSON.parse(JSON.stringify(payload));
                    const result = await this.db.update({ _id: id }, dados);

                    let message = 'Hero updated with success !';
                    if (!result.nModified)
                        message = 'No hero updated !';
                    else if (result.nModified > 1)
                        message = `${result.nModified} Heroes updated with success !`;

                    return {
                        message,
                        _id: result._id
                    };

                } catch (err) {
                    console.log('Unknown error : create : ', err);
                    return Boom.internal('Unknown error : create');
                }
            }
        }
    }

    delete() {
        return {
            path: '/heroes/{id}',
            method: 'DELETE',
            options: {
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
                    const { id } = request.params;
                    const result = await this.db.delete({ _id: id });

                    let message = 'Hero removed with success !';
                    if (!result.n)
                        message = 'No hero removed !';
                    else if (result.n > 1)
                        message = `${result.n} Heros removed !`;

                    return {
                        message,
                        _id: result._id
                    };

                } catch (err) {
                    console.log('Unknown error : create : ', err);
                    return Boom.internal('Unknown error : create');
                }
            }
        }
    }

}

module.exports = HeroesRoutes;