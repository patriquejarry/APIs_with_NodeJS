const ICrud = require('../interfaceCrud');
const Mongoose = require('mongoose');

const STATUS = {
    0: 'Desconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Desconectando'
}

class MongoDB extends ICrud {
    constructor(connection, schema) {
        super();
        this.connection = connection;
        this._schema = schema;
    }

    static async connect() {
        //if (!this.connection) {
        //await Mongoose.connect('mongodb://erickwendel:minhasenhasecreta@192.168.99.101:27017/herois',
        await Mongoose.connect(process.env.MONGODB_URL,
            { useNewUrlParser: true, useUnifiedTopology: true },
            function (error) {
                if (error) {
                    console.error('Falha na conexao', error);
                } else {
                    console.log('Conectou MongoDB!');
                }
            }
        );
        const connection = Mongoose.connection;
        connection.once('open', () => console.log('Database MongoDB rodando'));
        return connection;
        //}
        // this.defineModel();
    }

    // async defineModel() {
    //     if (!this._schema) {
    //         const schema = new Mongoose.Schema({
    //             nome: {
    //                 type: String,
    //                 required: true
    //             },
    //             poder: {
    //                 type: String,
    //                 required: true
    //             },
    //             insertedAt: {
    //                 type: Date,
    //                 default: new Date()
    //             }
    //         });

    //         this._schema = Mongoose.model('heroi', schema, 'herois');
    //     }
    // }

    async isConnected() {
        // MongoDB.connect();
        // const state = this.connection.readyState;

        //if (state === 1 /*'Conectado'*/) return state;
        //if (state !== 2 /*'Conectando'*/) return state;
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.connection.readyState;
    }

    async create(item) {
        // MongoDB.connect();
        const resultCadastrar = await this._schema.create(item);
        //console.log('resultCadastrar', resultCadastrar);
        return resultCadastrar;
    };

    async read(item, skip = 0, limit = 10) {
        // MongoDB.connect();
        try {
            return await this._schema.find(item).skip(parseInt(skip)).limit(parseInt(limit));
        } catch (err) {
            console.log('DEU RUIM no read', err)
            return null
        }
    };

    async update(itemBefore, item) {
        // MongoDB.connect();
        return await this._schema.updateMany(itemBefore, { $set: item });
    };

    async delete(item) {
        // MongoDB.connect();
        return await this._schema.deleteMany(item);
    };

};

module.exports = MongoDB;
