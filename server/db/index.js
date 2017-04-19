const conn = require('./conn');
const sync = (force) => conn.sync({ force });
const Tickets = require('./Tickets');
const Events = require('./Events');
const Organizations = require('./Organizations');
const Users = require('./Users');

module.exports = {
  sync,
  zd: {
    Tickets,
    Events,
    Organizations,
    Users
  }
};
