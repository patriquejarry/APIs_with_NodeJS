/*
    npm install sequelize pg pg-hstore
*/
const Sequelize = require('sequelize');
const driver = new Sequelize(
    'heroes',
    'erickwendel',
    'minhasenhasecreta',
    {
        host: '192.168.99.101',
        dialect: 'postgres',
        quoteIdentifiers: false,
        operatorsAliases: false
    }
);

async function main() {

    const Herois = driver.define('herois', {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: Sequelize.STRING,
            required: true
        },
        poder: {
            type: Sequelize.STRING,
            required: true
        }
    }, {
        tableName: 'TB_HEROIS',
        freezeTableName: false,
        timestamps: false
    });

    await Herois.sync();

    // await Herois.create({
    //     nome: 'Lanterna Verde',
    //     poder: 'Anel'
    // });

    const result = await Herois.findAll({
        raw: true
        //, attributes: ['nome']
    });
    console.log(result);
};

main();

