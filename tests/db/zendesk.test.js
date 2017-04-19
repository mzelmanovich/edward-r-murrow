const {expect} = require('chai');
const db = require('../../server/db');

describe('Zendesk Database Objects', function(){
  this.timeout(60000 * 2);

  describe('Database Connection', () => {

    it('Can connect to db', (done) => {
      db.sync(true)
      .then(() => done())
      .catch(done);
    });

  });

});
