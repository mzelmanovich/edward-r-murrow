const conn = require('./conn');
const sync = (force) => conn.sync({ force });
const Tickets = require('./Tickets');
const Events = require('./Events');

module.exports = {
  sync,
  zd:{
    Tickets
  }
};
