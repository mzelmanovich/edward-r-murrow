const {expect} = require('chai');
const db = require('../../server/db');

describe('Zendesk Database Objects', function(){
  this.timeout(60000 * 2);

  beforeEach((done)=>{
    db.sync(true)
      .then(() => done())
      .catch(done);
  });

  describe('Database Connection', () => {

    it('Can connect to db', (done) => {
      db.sync(true)
      .then(() => done())
      .catch(done);
    });

  });

  describe('Zendesk Model Schema', () => {

    it('Has ticket schema defined as expected', () => {
      const ticketModel = db.zd.Tickets.attributes;
      expect(ticketModel.id).to.be.a('object');
      expect(ticketModel.url).to.be.a('object');
      expect(ticketModel.status).to.be.a('object');
      expect(ticketModel.type).to.be.a('object');
      expect(ticketModel.subject).to.be.a('object');
      expect(ticketModel.priority).to.be.a('object');
      expect(ticketModel.due_at).to.be.a('object');
      expect(ticketModel.is_public).to.be.a('object');
      expect(ticketModel.created_at).to.be.a('object');
      expect(ticketModel.updated_at).to.be.a('object');
    });

    it('Has event schema defined as expected', () => {
      const ticketModel = db.zd.Events.attributes;
      expect(ticketModel.id).to.be.a('object');
      expect(ticketModel.type).to.be.a('object');
      expect(ticketModel.body).to.be.a('object');
      expect(ticketModel.public).to.be.a('object');
      expect(ticketModel.subject).to.be.a('object');
      expect(ticketModel.previous_value).to.be.a('object');
      expect(ticketModel.value).to.be.a('object');
      expect(ticketModel.field_name).to.be.a('object');
      expect(ticketModel.created_at).to.be.a('object');
      expect(ticketModel.updated_at).to.be.a('object');
    });

    it('Has org schema defined as expected', () => {
      const ticketModel = db.zd.Organizations.attributes;
      expect(ticketModel.id).to.be.a('object');
      expect(ticketModel.name).to.be.a('object');
      expect(ticketModel.created_at).to.be.a('object');
      expect(ticketModel.updated_at).to.be.a('object');
    });

    it('Has user schema defined as expected', () => {
      const ticketModel = db.zd.Users.attributes;
      expect(ticketModel.id).to.be.a('object');
      expect(ticketModel.email).to.be.a('object');
      expect(ticketModel.name).to.be.a('object');
      expect(ticketModel.active).to.be.a('object');
      expect(ticketModel.role).to.be.a('object');
      expect(ticketModel.created_at).to.be.a('object');
      expect(ticketModel.updated_at).to.be.a('object');
    });

  });

  describe('fetchById Class Methods', () => {

    it('Can fetch tickets', (done) =>{
      db.Tickets.fetchById(18146)
      .then(({id, subject}) =>{
        expect(id).to.equal(18146);
        expect(subject).to.equal('LMP-OWW-IBEX-MAN');
        done();
      })
      .catch(done);
    });

    it('Can fetch Orgs', (done) =>{
      db.Organizations.fetchById(651204445)
      .then(({id}) =>{
        expect(id).to.equal(651204445);
        done();
      })
      .catch(done);
    });

    it('Can fetch Users', (done) =>{
      db.Users.fetchById(859640749)
      .then(({id}) =>{
        expect(id).to.equal(651204445);
        done();
      })
      .catch(done);
    });

  });
});
