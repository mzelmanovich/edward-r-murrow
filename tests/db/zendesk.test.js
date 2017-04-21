const {expect} = require('chai');
const db = require('../../server/db');

describe('Zendesk Database Objects', function(){
  this.timeout(60000 * 3);

  beforeEach((done) => {
    db.sync(true)
      .then(() => done())
      .catch(done);
  });

  afterEach((done) => {
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

    it('Can fetch tickets', (done) => {
      db.zd.Tickets.fetchById(18146)
      .then(({id, subject}) => {
        expect(id).to.equal(18146);
        expect(subject).to.equal('LMP-OWW-IBEX-MAN');
        done();
      })
      .catch(done);
    });

    it('Can fetch Orgs', (done) => {
      db.zd.Organizations.fetchById(651204445)
      .then(({id}) => {
        expect(id).to.equal(651204445);
        done();
      })
      .catch(done);
    });

    it('Can fetch Users', (done) => {
      db.zd.Users.fetchById(859640749)
      .then(({id}) => {
        expect(id).to.equal(859640749);
        done();
      })
      .catch(done);
    });

    it('Can fetch Users', (done) => {
      db.zd.Events.fetchById(18146)
      .then((arr) => {
        expect(arr[0].ticket_id).to.equal(18146);
        done();
      })
      .catch(done);
    });

  });

  describe('resolveForeignKeys', () => {

    it('Gets A User and their Org', (done) => {
      db.zd.Users.fetchById(859640749)
      .then( user  => db.zd.Users.resolveForeignKeys(user) )
      .then(({organization_id}) => {
        expect(organization_id).to.equal('24928435');
        return {organization_id};
      })
      .then(({organization_id}) => db.zd.Organizations.findById(organization_id))
      .then(({name}) => {
        expect(name).to.equal('Catchpoint');
        done();
      })
      .catch(done);
    });

    it('Get A Ticket and its ForeignKeys', (done) => {

      db.zd.Tickets.fetchById(18146)
      .then(ticket => db.zd.Tickets.resolveForeignKeys(ticket))
      .then((ticket) => {
        const {id, assignee_id, requester_id, submitter_id} = ticket;
        expect(id).to.equal('18146');
        expect(assignee_id).to.equal('490406769');
        expect(requester_id).to.be.greaterThan(100);
        expect(submitter_id).to.be.greaterThan(100);
        return ticket.getAssignee();
      })
      .then(({id, name}) => {
        expect(id).to.equal('490406769');
        expect(name).to.equal('Ram Suriyanarayanan');
        done();
      })
      .catch(done);
    });
  });

  describe('Follow Up Tickets', () => {

    it('Gets a follow up and adds the id', (done) => {
      db.zd.Tickets.fetchById(16595)
      .then(ticket => db.zd.Tickets.resolveForeignKeys(ticket))
      .then(({follow_up_id}) => {
        expect(follow_up_id).to.equal('15721');
        done();
      })
      .catch(done);
    });

    it('Gets ticket custom fields', (done) => {
      db.zd.Tickets.fetchById(18146)
      .then(ticket => db.zd.Tickets.resolveForeignKeys(ticket))
      .then((ticket) => {
        expect(ticket.getDataValue('esc_tam')).to.equal('Ram Suriyanarayan');
        expect(ticket.getDataValue('esc_tt')).to.equal('Nilabh Mishra');
        expect(ticket.getDataValue('user_story_id')).to.equal('OPS:3324');
        expect(ticket.getDataValue('esc_status')).to.equal('suc_esc');
        expect(ticket.getDataValue('esc_type')).to.equal('ops_esc');
        expect(ticket.getDataValue('category')).to.equal('system_health__onprem_node_health');
        expect(ticket.getDataValue('satisfaction_rating')).to.equal('offered');
        done();
      })
      .catch(done);
    });

  });

  describe('Ticket Events', () => {
    let events = [];
    it('Saves to db', (done) => {
      db.zd.Events.fetchById(18146)
     .then(apiEvents => {
       events = apiEvents;
     })
     .then(() => {
       console.log(events);
       events = events.map(event => db.zd.Events.resolveForeignKeys(event));
       return Promise.all(events);
     })
     .then((dbEvents) => {
       expect(dbEvents[0].ticket_id * 1).to.be.equal(18146);
       done();
     })
     .catch(done);
    });
  });
});
