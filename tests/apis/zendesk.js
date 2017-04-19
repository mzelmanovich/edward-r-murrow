const {expect} = require('chai');
const Zendesk = require('../../server/rest apis/zendesk');
const config = require('../../config');
const zd = new Zendesk(config.zendesk);

describe('Zendesk API Tests', function(){

  describe('Get Request', () => {

    describe('Events', () => {

      it('Gets expected result', (done) => {

        zd.getEvents(18146)
        .then(events => {
          expect(events.length).to.equal(116);
          const index = Math.floor(Math.random() * (116 - 0)) + 0;
          expect(events[index].ticket_id).to.equal(18146);
          done();
        }).catch(done);

      });

    });

  });

});
