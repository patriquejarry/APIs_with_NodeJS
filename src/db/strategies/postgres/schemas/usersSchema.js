const Sequelize = require('sequelize');

const UsersSchema = {
    name: 'users',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            required: true,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            required: true
        }
    },
    options: {
        tableName: 'TB_USERS',
        freezeTableName: false,
        timestamps: false
    }
};

module.exports = UsersSchema;