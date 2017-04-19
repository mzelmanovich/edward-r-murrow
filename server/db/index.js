const conn = require('./conn');
const sync = (force) => conn.sync({ force });
const Tickets = require('./Tickets');
const Events = require('./Events');
const Organizations = require('./Organizations');
const Users = require('./Users');

Tickets.belongsTo(Users, { as: 'requester' });
Tickets.belongsTo(Users, { as: 'assignee' });
Tickets.belongsTo(Users, { as: 'submitter' });

Tickets.belongsTo(Organizations, { onDelete: 'CASCADE' });
Organizations.hasMany(Tickets);

Tickets.hasMany(Events, { onDelete: 'CASCADE' });
Events.belongsTo(Tickets, { onDelete: 'CASCADE' });
Events.belongsTo(Users, { as: 'author' });

Users.belongsTo(Organizations, { onDelete: 'CASCADE' });
Organizations.hasMany(Users, { onDelete: 'CASCADE' });

console.log(Tickets);

module.exports = {
  sync,
  zd: {
    Tickets,
    Events,
    Organizations,
    Users
  }
};
