const Mongoose = require('mongoose');
Mongoose.connect('mongodb://erickwendel:minhasenhasecreta@192.168.99.101:27017/herois', { useNewUrlParser: true, useUnifiedTopology: true },
    function (error) {
        if (error) {
            console.error('Falha na conexao', error);
        } else {
            console.log('Conectou!');
        }
    }
);

const connection = Mongoose.connection;
connection.once('open', () => console.log('Database rodando'));
const state = connection.readyState;
console.log('state', state);
/*
0: Disconectado
1: Conectado
2: Conectando
3: Disconectando
*/
setTimeout(() => {
    const state = connection.readyState;
    console.log('state', state);
}, 1000);


const heroiSchema = new Mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    poder: {
        type: String,
        required: true
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
});

const model = Mongoose.model('heroi', heroiSchema, 'herois');

async function main() {
    const resultCadastrar = await model.create({ nome: 'Batman', poder: 'Dinheiro' });
    console.log('resultCadastrar', resultCadastrar);

    const listItems = await model.find();
    console.log('listItems', listItems);
}

main();
