const {expect} = require('chai');
const Zendesk = require('../../server/rest apis/zendesk');
const zd = Zendesk.catchpointsystems;

describe('Zendesk API Tests', function(){
  this.timeout(60000 * 2);
  describe('Get Requests', () => {

    it('Gets events', (done) => {

      zd.getEvents(18146)
        .then(events => {
          expect(events.length).to.equal(116);
          const index = Math.floor(Math.random() * (116 - 0)) + 0;
          expect(events[index].ticket_id).to.equal(18146);
          done();
        }).catch(done);

    });

    it('Gets Tickets', (done) =>{
      zd.getTicket(18146)
      .then(({id, subject}) =>{
        expect(id).to.equal(18146);
        expect(subject).to.equal('LMP-OWW-IBEX-MAN');
      })
      .catch(done);
    });


    it('Gets organization', (done) => {

      zd.getOrg(651204445)
        .then(({name}) => {
          expect(name).to.equal('Honeywell');
          done();
        }).catch(done);

    });

    it('Gets user', (done) => {

      zd.getUser(859640749)
        .then(({name, organization_id}) => {
          expect(name).to.equal('Greg Rubin');
          expect(organization_id).to.equal(24928435);
          done();
        }).catch(done);

    });


  });

});
