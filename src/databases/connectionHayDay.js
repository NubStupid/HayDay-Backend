const Sequelize = require("sequelize");
const config = require("../config/config");

const { host, username, password, database, port, dialect } =
    config.hayday_connection;

const dbHayDay = new Sequelize(database, username, password, {
    host: host,
    port: port,
    dialect: dialect,
});

module.exports = dbHayDay;
