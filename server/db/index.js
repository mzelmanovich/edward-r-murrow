const conn = require('./conn');
const sync = (force)=> conn.sync({ force });

module.exports ={
  sync
};
