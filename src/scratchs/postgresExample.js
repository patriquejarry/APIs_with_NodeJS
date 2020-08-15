const Sequelize = require('sequelize');

const { DB_CONFIG } = require('./configs');

const driver = new Sequelize(
    'heroes',
    DB_CONFIG.username,
    DB_CONFIG.password,
    {
        host: DB_CONFIG.host,
        dialect: 'postgres',
        quoteIdentifiers: false
        //,operatorsAliases: false
    }
);

async function main() {

    const Heroes = driver.define('heroes', {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            required: true
        },
        power: {
            type: Sequelize.STRING,
            required: true
        }
    }, {
        tableName: 'TB_HEROES',
        freezeTableName: false,
        timestamps: false
    });

    await Heroes.sync();

    // await Heroes.create({
    //     name: 'Green Lantern',
    //     power: 'Ring'
    // });

    const result = await Heroes.findAll({
        raw: true
        //, attributes: ['name']
    });
    console.log(result);
};

main();

