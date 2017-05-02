const cp = require('../../rest apis/zendesk').catchpointsystems;
const conn = require('../conn');

const fetchEvents = function(){
  return cp.getEvents(this.id)
  .then(events => Promise.all(events.map(event => conn.model('event').resolveForeignKeys(event))))
  .then(() => conn.model('ticket').findById(this.id, {include: [{all: true}]}))
  .then(ticket => ticket.sortEvents());
};

const sortEvents =  function() {
  if (this.events === undefined) {
    throw new ReferenceError('Events not inclucded!', 'instanceMethod', 12);
  }
  this.events = this.events.sort((first, second) => {
    if (first.created_at < second.created_at) {
      return -1;
    }
    if (first.created_at > second.created_at) {
      return 1;
    }
    return 0;
  });
  return this;
};

const enrichEvents = function(){
  return conn.model('event').findAll({where: {ticket_id: this.id}}).then(events => {
    if (events.length){
      return () => conn.model('ticket').findById(this.id, {include: [{all: true}]})
      .then(ticket => ticket.sortEvents());
    }
    return this.fetchEvents();
  });
};


const findLastEvent = function(obj) {
  const keys = Object.keys(obj);
  return this.enrichEvents()
  .then(({events}) => {
    return events.reverse()
              .find(event => {
                event = event.get();
                for (let key of keys) {
                  if (event[key] !== obj[key]) {
                    return false;
                  }
                }
                return true;
              });
  });
};
const findFirstEvent = function(obj) {
  return this.enrichEvents()
     .then(({events}) => {
       if (!events.length){
         return null;
       }
       const keys = Object.keys(obj);
       return this.events.find(event => {
         event = event.get();
         for (let key of keys){
           if (event[key] !== obj[key]) {
             return false;
           }
         }
         return true;
       });
     });
};

module.exports = {
  fetchEvents,
  enrichEvents,
  findFirstEvent,
  sortEvents,
  findLastEvent
};
