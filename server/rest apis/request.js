const needle = require('needle');
const blueBird = require('bluebird');

const request = blueBird.promisify(needle.request);
request.get = blueBird.promisify(needle.get);
request.post = blueBird.promisify(needle.post);
request.put = blueBird.promisify(needle.put);

module.exports = request;
