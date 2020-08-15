const Mongoose = require('mongoose');
const ICrud = require('../interfaceCrud');

const STATUS = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
};

class MongoDB extends ICrud {

    constructor(connection, schema) {
        super();
        this.connection = connection;
        this.schema = schema;
    }

    static async connect() {

        try {
            await Mongoose.connect(process.env.MONGODB_URL,
                { useNewUrlParser: true, useUnifiedTopology: true },
                function (error) {
                    if (error) {
                        console.error('MongoDB : Connection fail', error);
                    } else {
                        console.log('MongoDB : Connected!');
                    }
                }
            );

            const connection = Mongoose.connection;
            connection.once('open', () => console.log('MongoDB : Database is running'));
            return connection;

        } catch (err) {
            console.log('Unknown error : connect : ', err);
            return false;
        }
    }

    async isConnected() {

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return this.connection.readyState;

        } catch (err) {
            console.log('Unknown error : isConnected : ', err);
            return false;
        }
    }

    async create(item) {

        try {
            const result = await this.schema.create(item);
            if (process.env.DEBUG) {
                console.log('create', result);
            }
            return result;

        } catch (err) {
            console.log('Unknown error : create : ', err);
            return null;
        }
    };

    async read(item, skip = 0, limit = 10) {
        try {
            const result = await this.schema.find(item).skip(parseInt(skip)).limit(parseInt(limit));
            if (process.env.DEBUG) {
                console.log('read', result);
            }
            return result;

        } catch (err) {
            console.log('Unknown error : read : ', err);
            return null;
        }
    };

    async update(itemBefore, item) {

        try {
            const result = await this.schema.updateMany(itemBefore, { $set: item });
            if (process.env.DEBUG) {
                console.log('update', result);
            }
            return result;

        } catch (err) {
            console.log('Unknown error : update : ', err);
            return null;
        }
    };

    async delete(item) {

        try {
            const result = await this.schema.deleteMany(item);
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

module.exports = MongoDB;
