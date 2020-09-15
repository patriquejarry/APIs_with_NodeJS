const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const Jwt = require('jsonwebtoken');

const BaseRoutes = require('./baseRoutes');
const PasswordHelper = require('../helpers/passwordHelper');

const failAction = (request, headers, erro) => {
    throw erro;
};

class AuthRoutes extends BaseRoutes {

    constructor(secret, db) {
        super();
        this.secret = secret;
        this.db = db;
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,        // disables authentication
                tags: ['api'],
                description: 'Get token',
                notes: 'Makes login with user and password and return a token',
                validate: {
                    failAction,
                    payload: Joi.object({
                        name: Joi.string().required(),
                        password: Joi.string().required()
                    })
                }
            },
            handler: async (request) => {
                const { name, password } = request.payload;
                const [user] = await this.db.read({
                    //name: name.toLowerCase()
                    name
                })
                if (!user) {
                    return Boom.unauthorized();
                }

                const match = await PasswordHelper.comparePassword(password, user.password);
                if (!match) {
                    return Boom.unauthorized('User and password invalid !');
                };

                const token = Jwt.sign({
                    name: name,
                    id: user.id
                }, this.secret);
                return { token };
            }
        }
    }
}

module.exports = AuthRoutes