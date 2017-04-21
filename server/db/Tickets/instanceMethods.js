const cp = require('../../rest apis/zendesk').catchpointsystems;
const conn = require('../conn');

const fetchEvents = function(){
  return cp.getEvents(this.id)
  .then(events => Promise.all(events.map(event => conn.model('event').resolveForeignKeys(event))))
  .then(() => conn.model('ticket').findById(this.id, {include: [{all: true}]}));
};

const enrichEvents = function(){
  return this.getEvents().then(events => {
    if (events.length){
      return () => conn.model('ticket').findById(this.id, {include: [{all: true}]});
    }
    return this.fetchEvents();
  });
};

module.exports = {
  fetchEvents,
  enrichEvents
};
