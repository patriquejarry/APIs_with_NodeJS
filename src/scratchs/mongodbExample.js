const Mongoose = require('mongoose');

const { DB_CONFIG } = require('./configs');

Mongoose.connect('mongodb://' + DB_CONFIG.username + ':' + DB_CONFIG.password + '@' + DB_CONFIG.host + ':27017/heroes',
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (error) {
        if (error) {
            console.error('Error on database connection', error);
        } else {
            console.log('Database connected !');
        }
    }
);

const connection = Mongoose.connection;
connection.once('open', () => console.log('Database running'));

/*
0: Disconnected
1: Connected
2: Connecting
3: Disconnecting
*/
const state = connection.readyState;
console.log('state', state);
setTimeout(() => {
    const state = connection.readyState;
    console.log('state', state);
}, 1000);


const heroesSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    power: {
        type: String,
        required: true
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
});

const model = Mongoose.model('heroes', heroesSchema, 'heroes');

async function main() {
    const resultCreate = await model.create({ name: 'Batman', power: 'Money' });
    console.log('resultCreate', resultCreate);

    const listItems = await model.find();
    console.log('listItems', listItems);
};

main();
