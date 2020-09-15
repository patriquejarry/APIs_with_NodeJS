const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert');


const initConfig = function () {

    const env = process.env.NODE_ENV || "dev";
    ok(env === "dev" || env === "production", "The 'env' is invalid, [dev | production]");

    const configPath = join(__dirname, '../../config', `.env.${env}`);
    config({ path: configPath });
};

const DB_CONFIG = {
    username: 'patrique',
    password: 'minhasenhasecreta',
    host: '192.168.99.101'
};

module.exports = { initConfig, DB_CONFIG };