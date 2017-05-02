const Sequelize = require('sequelize');

const logging = !!process.env.SQL_LOGGING;

const conn = new Sequelize(process.env.DATABASE_URL || require('../../config').DATABASE_URL, {
  logging
});

module.exports = conn;
