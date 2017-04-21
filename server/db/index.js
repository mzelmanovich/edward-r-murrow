const conn = require('./conn');
const sync = (force) => conn.sync({ force });
const Tickets = require('./Tickets');
const Events = require('./Events');
const Organizations = require('./Organizations');
const Users = require('./Users');
const zd = require('../rest apis/zendesk').catchpointsystems;
const Promise = require('bluebird');

//Assosiations
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

const modelMap = {
  author_id: Users,
  assignee_id: Users,
  requester_id: Users,
  submitter_id: Users,
  ticket_id: Tickets,
  organization_id: Organizations
};

const resolveForeignKeys = function(instance) {
  let promArr = [];
  for (let key in modelMap) {
    const id = instance[key];
    if (id) {
      const model = modelMap[key];
      let prom =  model.findById(id, { attributes: ['id'] }).then(obj =>
        obj ? obj : model.fetchById(id).then(apiObj => model.resolveForeignKeys(apiObj))
      );
      promArr.push(prom);
    }
  }
  return Promise.all(promArr).then(() => this.upsert(instance)).then(() => this.findById(instance.id));
};

Organizations.fetchById = function(id){
  return zd.getOrg(id);
};

Organizations.resolveForeignKeys = resolveForeignKeys;

Users.fetchById = function(id){
  return zd.getUser(id);
};

Users.resolveForeignKeys = resolveForeignKeys;

Tickets.fetchById = function(id){
  return zd.getTicket(id);
};

Tickets.resolveForeignKeys = resolveForeignKeys;

Events.fetchById = function(id){
  return zd.getEvents(id);
};

Events.resolveForeignKeys = resolveForeignKeys;

module.exports = {
  sync,
  zd: {
    Tickets,
    Events,
    Organizations,
    Users
  }
};
