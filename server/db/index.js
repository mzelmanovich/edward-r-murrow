const conn = require('./conn');
const sync = (force) => conn.sync({ force });
const Tickets = require('./Tickets');

module.exports = {
  sync,
  zd:{
    Tickets
  }
};
