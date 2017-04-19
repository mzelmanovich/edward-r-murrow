const Sequelize = require('sequelize');

const logging = process.env.SQL_LOGGING ? true : false;

const conn = new Sequelize(process.env.DATABASE_URL, {
  logging
});

module.exports = conn;
