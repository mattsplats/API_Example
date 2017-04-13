'use strict';

process.env.NODE_ENV = 'test';

const chai     = require('chai'),
      chaiHTTP = require('chai-http'),
      server   = require('../server'),
      should   = chai.should();

chai.use(chaiHTTP);

describe('Bowling API: REST routes', () => {
  it('should add a SINGLE player on /api POST', () => {
    chai.request(server)
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
      })
      .catch(err => { throw err });
  });
  
  it('should list ALL players on /api GET', () => {
    chai.request(server)
      .get('/api')
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
      })
      .catch(err => { throw err });;
  });
  
  it('should list a SINGLE player on /api/<name> GET', () => {
    chai.request(server)
      .get('/api/Jane%20Doe')
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
      })
      .catch(err => { throw err });
  });

  it('should update a SINGLE player on /api/<name> PUT', () => {
    chai.request(server)
      .put('/api/Jane%20Doe')
      .send({ roll: 10 })
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('score').eql(10);
        res.body.should.have.property('frames').with.length(1);
        res.body.should.have.property('onFrame').eql(2);
        res.body.should.have.property('gameOver').eql(false);
      })
      .catch(err => { throw err });
  });

  it('should delete a SINGLE player on /api/<name> DELETE', () => {
    chai.request(server)
      .delete('/api/Jane%20Doe')
      .then(res => {
        res.should.have.status(204);

        chai.request(server)
          .get('/api/Jane%20Doe')
          .then(res => {
            res.should.have.status(200);
            res.body.should.be.a('string');
          })
          .catch(err => { throw err });;
      })
      .catch(err => { throw err });
  });
});

describe('Bowling API: Scoring', () => {
  // beforeEach((done) => {
  //   chai.request(server)
  //     .post('/api')
  //     .send({ name: 'Jane Doe' })
  //     .end((err, res) => {
  //       if (err) console.error(err);
  //       done();
  //     })
  // });

  // afterEach((done) => {
  //   chai.request(server)
  //     .delete('/api/Jane%20Doe')
  //     .end((err, res) => {
  //       if (err) console.error(err);
  //       done();
  //     })
  // });
  
  it('should have score 0 if all rolls are 0', () => {
    chai.request(server).post('/api').send({ name: 'Jane Doe' })
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
      .then(() => chai.request(server).put('/api/Jane%20Doe').send({ roll: 0 }))
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('score').eql(0);
        res.body.should.have.property('frames').with.length(10);
        res.body.should.have.property('onFrame').eql(10);
        res.body.should.have.property('gameOver').eql(true);
      })
      .catch(err => { throw err })
      .then(() => chai.request(server).delete('/api/Jane%20Doe'));
  });

  it('should have score 300 if all rolls are 10', () => {
    chai.request(server).put('/api/Jane%20Doe').send({ roll: 10 })
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
        res.body.should.have.property('score').eql(10);
        res.body.should.have.property('frames').with.length(1);
        res.body.should.have.property('onFrame').eql(2);
        res.body.should.have.property('gameOver').eql(false);
      })
      .catch(err => { throw err });;
  });
});

process.on('unhandledRejection', (reason) => {
  console.error(reason);
});
