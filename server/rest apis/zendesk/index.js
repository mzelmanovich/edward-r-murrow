const request = require('../request');
const get = request.get;
const BlueBird = require('bluebird');
const moment = require('moment');

const getRequest = (url, authHeader, timeout = 0) => {
  return new BlueBird((resolve, reject) => {
    setTimeout(() => {
      get(url, { headers: { Authorization: `Basic ${authHeader}` } })
      .then(resp => resolve(resp))
      .catch(err => {
        if (err.code === 'ENOTFOUND' || err.code === 'ECONNRESET') {
          return getRequest(url, authHeader, timeout);
        }
        reject(err);
      });
    }, timeout);
  })
  .then(resp => {
    if (resp.statusCode === 200) {
      return resp;
    }
    if (resp.statusCode === 429) {
      timeout = resp.headers['retry-after'] * 1000;
      return getRequest(url, authHeader, timeout);
    }
    if (resp.body.error){
      throw resp.body;
    }
    throw resp;
  });
};

class Zendesk{

  constructor({domain, userName, token}){
    this.domain = domain;
    this.authHeader = this.makeAuthHeader(userName, token);
    this.requestPromiseChain = BlueBird.resolve(true);
  }

  makeAuthHeader (userName, token) {
    return new Buffer(userName + '/token:' + token).toString('base64');
  }

  getRequest(url, timeout = 0){
    // let prom = this.requestPromiseChain.then(() => {
    //   return getRequest(url, this.authHeader, timeout);
    // });

    let prom = getRequest(url, this.authHeader, timeout);
    prom.recursive = () => this.makeRecursive(prom);
    // this.requestPromiseChain = prom;
    return prom;
  }

  makeRecursive(requestPromise) {
    const responses = [];
    const recursiveFunc = ({ body }) => {
      responses.push(body);
      return body.next_page ? this.getRequest(body.next_page).then(recursiveFunc) : responses;
    };
    return requestPromise.then(recursiveFunc);
  }

  makeUrl ({ id, prefix, suffix}){
    let url = `https://${this.domain}.zendesk.com/api/v2/${prefix}`;
    if (id) {
      url += '/' + id;
    }
    if (suffix) {
      url += '/' + suffix;
    }
    return url + '.json';
  }

  search(searchString) {
    const url = this.makeUrl({ prefix: 'search' }) + `?query=${searchString}`;
    return this.getRequest(url);
  }

  getEscalations(date = moment().subtract(3, 'months')) {
    if (date.format){
      date = date.format('YYYY-M-D');
    }
    return this.search(`created>${date} tags:bug_esc tags:enh_esc tags:ops_esc type:ticket`)
            .recursive()
            .then(bodies => {
              const tickets = [];
              bodies.forEach(({ results }) => {
                results.forEach(ticket => {
                  tickets.push(ticket);
                });
              });
              return tickets;
            });
  }

  getUser(id) {
    const url = this.makeUrl({ id, prefix: 'users' });
    return this.getRequest(url).then(({body}) => body.user);
  }

  getOrg(id) {
    const url = this.makeUrl({ id, prefix: 'organizations' });
    return this.getRequest(url).then(({body}) => body.organization);
  }

  getAudits(id) {
    const url = this.makeUrl({ id, prefix: 'tickets', suffix: 'audits' });
    return this.getRequest(url).recursive();
  }

  getTicket(id){
    const url = this.makeUrl({ id, prefix: 'tickets'});
    return this.getRequest(url).then(({body}) => body.ticket);
  }

  getEvents(id) {
    return this.getAudits(id)
    .then(auditResponses => {
      let returnEvents = [];
      auditResponses.forEach(({audits}) => {
        audits.forEach(({created_at, updated_at, ticket_id, author_id, events}) => {
          events.forEach(event => {
            event.created_at = created_at;
            event.updated_at = updated_at;
            event.ticket_id = ticket_id;
            event.author_id = author_id > -1 ? author_id : null;
            returnEvents.push(event);
          });
        });
      });
      return returnEvents;
    });
  }

  getCustomFieldName(feildId){
    if (feildId === 23684505){
      return 'esc_type';
    }

    if (feildId === 23746995){
      return 'user_story_id';
    }

    if (feildId === 23778369){
      return 'esc_status';
    }

    if (feildId === 24667426){
      return 'esc_tam';
    }

    if (feildId === 24736606){
      return 'esc_tt';
    }

    if (feildId === 23308995){
      return 'category';
    }
    return null;
  }
}

const catchpointsystemsConfig = {
  userName: process.env.ZD_USERNAME,
  token: process.env.ZD_TOKEN,
  domain: process.env.ZD_DOMAIN
};

Zendesk.catchpointsystems = new Zendesk(catchpointsystemsConfig);

module.exports = Zendesk;
