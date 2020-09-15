const Mongoose = require('mongoose');

const schema = new Mongoose.Schema({
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

module.exports = Mongoose.model('heroes', schema, 'heroes');
