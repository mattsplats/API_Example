'use strict';

process.env.NODE_ENV = 'test';

const chai     = require('chai'),
      server   = require('../server'),
      should   = chai.should();

chai.use(require('chai-http'));
chai.use(require('chai-things'));

describe('Bowling API: Basic routes', () => {
  it('should add a SINGLE player on /api POST', () => {
    return chai.request(server)
      .post('/api')
      .send({ name: 'Jane Doe' })
      .then(res => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('name');
        res.body.should.have.property('score').eql(0);
        res.body.should.have.property('frames').with.length(0);
        res.body.should.have.property('onFrame').eql(1);
        res.body.should.have.property('gameOver').eql(false);
        return res;
      });
  });
  
  it('should list ALL players on /api GET', () => {
    return chai.request(server)
      .get('/api')
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
      });
  });
  
  it('should list a SINGLE player on /api/<name> GET', () => {
    return chai.request(server)
      .get('/api/Jane%20Doe')
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
      });
  });

  it('should update a SINGLE player on /api/<name> PUT', () => {
    return chai.request(server)
      .put('/api/Jane%20Doe')
      .send({ roll: 10 })
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('score').eql(10);
        res.body.should.have.property('frames').with.length(1);
        res.body.should.have.property('onFrame').eql(2);
        res.body.should.have.property('gameOver').eql(false);
      });
  });

  it('should delete a SINGLE player on /api/<name> DELETE', () => {
    return chai.request(server)
      .delete('/api/Jane%20Doe')
      .then(res => {
        res.should.have.status(204);

        return chai.request(server)
          .get('/api/Jane%20Doe')
          .then(res => {
            res.should.have.status(200);
            res.body.should.be.a('string');
          });
      });
  });
});

describe('Bowling API: Scoring', () => {
  beforeEach(() => {
    return chai.request(server)
      .post('/api')
      .send({ name: 'Jane Doe' })
      .then(res => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('name');
        res.body.should.have.property('score').eql(0);
        res.body.should.have.property('frames').with.length(0);
        res.body.should.have.property('onFrame').eql(1);
        res.body.should.have.property('gameOver').eql(false);
      });    
  });

  afterEach(() => {
    return chai.request(server)
      .delete('/api/Jane%20Doe')
      .then(res => {
        res.should.have.status(204);

        return chai.request(server)
          .get('/api/Jane%20Doe')
          .then(res => {
            res.should.have.status(200);
            res.body.should.be.a('string');
          });
      });
  });
  
  it('should have score 0 if all rolls are 0', () => {
    return chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 })
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('score').eql(0);
        res.body.should.have.property('frames').with.length(10);
        res.body.should.have.property('onFrame').eql(10);
        res.body.should.have.property('gameOver').eql(true);
      });
  });

  it('should have score 300 if all rolls are 10', () => {
    return chai.request(server).put('/api/Jane%20Doe').send({ roll: 10 })
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 10 }))
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('score').eql(300);
        res.body.should.have.property('frames').with.length(10);
        res.body.frames.should.include.something.that.deep.equals({ roll1: 'X', score: 150 });
        res.body.should.have.property('onFrame').eql(10);
        res.body.should.have.property('gameOver').eql(true);
      });
  });
})

process.on('unhandledRejection', reason => {
  console.error(reason);
  process.exit(1);
});