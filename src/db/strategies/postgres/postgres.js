const Sequelize = require('sequelize');

const ICrud = require('../interfaceCrud');

class Postgres extends ICrud {

    constructor(connection, schema) {
        super();
        this.connection = connection;
        this.schema = schema;
    }

    static connect() {

        try {
            this.connection = new Sequelize(process.env.POSTGRES_URL, {
                //operatorsAliases: false,
                quoteIdentifiers: false,
                logging: false,
                ssl: process.env.SSL_DB,
                dialectOptions: {
                    ssl: process.env.SSL_DB
                }
            });
            return this.connection;

        } catch (err) {
            console.log('Unknown error : connect : ', err);
            return null;
        }
    }

    static async defineModel(connectionPostgres, schema) {

        try {
            this.schema = connectionPostgres.define(schema.name, schema.schema, schema.options);
            await this.schema.sync();
            return this.schema;

        } catch (err) {
            console.log('Unknown error : defineModel : ', err)
            return null;
        }
    }

    async isConnected() {

        try {
            await this.connection.authenticate();
            return true;

        } catch (err) {
            console.log('Unknown error : isConnected : ', err);
            return false;
        }
    }

    async create(item) {

        try {
            const { dataValues: result } = await this.schema.create(item);
            if (process.env.DEBUG) {
                console.log('create', result);
            }
            return result;

        } catch (err) {
            console.log('Unknown error : create : ', err);
            return null;
        }
    };

    async read(item) {

        try {
            const result = await this.schema.findAll({ where: item, raw: true });
            if (process.env.DEBUG) {
                console.log('read', result);
            }
            return result;

        } catch (err) {
            console.log('Unknown error : read : ', err);
            return null;
        }
    };

    async update(itemBefore, item, upsert = false) {

        try {
            const fn = upsert ? 'upsert' : 'update'
            const result = await this.schema[fn](item, { where: itemBefore });
            if (process.env.DEBUG) {
                console.log('update', result);
            }
            return result;

        } catch (err) {
            console.log('Unknown error : update : ', err)
            return null;
        }
    };

    async delete(item) {

        try {
            const result = await this.schema.destroy({ where: item });
            if (process.env.DEBUG) {
                console.log('delete', result);
            }
            return result;

        } catch (err) {
            console.log('Unknown error : delete : ', err);
            return null;
        }
    };

};

module.exports = Postgres;
