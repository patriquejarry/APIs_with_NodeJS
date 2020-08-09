const ICrud = require('../interfaceCrud');
const Sequelize = require('sequelize');

class Postgres extends ICrud {
    constructor(connection, schema) {
        super();
        this._connection = connection;
        this._schema = schema;
    }

    static connect() {
        if (!this._connection) {
            // this._connection = new Sequelize(
            //     'heroes',
            //     'erickwendel',
            //     'minhasenhasecreta',
            //     {
            //         host: '192.168.99.101',
            //         dialect: 'postgres',
            //         quoteIdentifiers: false,
            //         operatorsAliases: false,
            //         logging: false
            //     }
            // );
            this._connection = new Sequelize(process.env.POSTGRES_URL,
                {
                    quoteIdentifiers: false,
                    //operatorsAliases: false,
                    logging: false,
                    ssl: process.env.SSL_DB,
                    dialectOptions: {
                        ssl: process.env.SSL_DB
                    }
                }
            );
        }
        return this._connection;
        // this.defineModel();
    }

    static async defineModel(connectionPostgres, schema) {
        if (!this._schema) {
            this._schema = connectionPostgres.define(schema.name, schema.schema, schema.options);
            await this._schema.sync();
        }
        return this._schema
    }

    // async defineModel() {
    //     if (!this._schema) {
    //         this._schema = this._connection.define('herois', {
    //             id: {
    //                 type: Sequelize.INTEGER,
    //                 required: true,
    //                 primaryKey: true,
    //                 autoIncrement: true
    //             },
    //             nome: {
    //                 type: Sequelize.STRING,
    //                 required: true
    //             },
    //             poder: {
    //                 type: Sequelize.STRING,
    //                 required: true
    //             }
    //         }, {
    //             tableName: 'TB_HEROIS',
    //             freezeTableName: false,
    //             timestamps: false
    //         });

    //         // await this._schema.sync();
    //     }
    // }

    async isConnected() {
        Postgres.connect();
        try {
            await this._connection.authenticate();
            return true;

        } catch (error) {
            console.log('fail !', error);
            return false;
        }
    }

    async create(item) {
        Postgres.connect();
        const { dataValues } = await this._schema.create(item);
        return dataValues;
    };

    async read(item) {
        Postgres.connect();
        // console.log('item', item)
        return await this._schema.findAll({ where: item, raw: true });
    };

    async update(itemBefore, item, upsert = false) {
        Postgres.connect();
        const fn = upsert ? 'upsert' : 'update'
        return await this._schema[fn](item, { where: itemBefore });
    };

    async delete(item) {
        Postgres.connect();
        return await this._schema.destroy({ where: item });
    };

};

module.exports = Postgres;
