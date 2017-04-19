const config = require('../config');
const Zendesk = require('../server/rest apis/zendesk');
const zd = new Zendesk(config.zendesk);
zd.getEscalations().then( x => console.log(x));
