const request = require('../request');
const get = request.get;
const BlueBird = require('bluebird');


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
    new Buffer(userName + '/token:' + token).toString('base64');
  }

  getRequest(url, timeout = 0){
    let prom = this.requestPromiseChain.then(() => {
      return getRequest(url, this.authHeader, timeout);
    });
    prom.recursive = () => this.makeRecursive(prom);
    this.requestPromiseChain = prom;
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

}

module.exports = Zendesk;
