'use strict';

process.env.NODE_ENV = 'test';

const chai     = require('chai'),
      chaiHTTP = require('chai-http'),
      server   = require('../server'),
      should   = chai.should();

chai.use(chaiHTTP);

describe('Bowling API: Basic routes', () => {
  it('should add a SINGLE player on /api POST', done => {
    chai.request(server)
      .post('/api')
      .send({ name: 'Jane Doe' })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('name');
        res.body.should.have.property('score').eql(0);
        res.body.should.have.property('frames').with.length(0);
        res.body.should.have.property('onFrame').eql(1);
        res.body.should.have.property('gameOver').eql(false);
        done();
      });
  });
  
  it('should list ALL players on /api GET', done => {
    chai.request(server)
      .get('/api')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
        done();
      });
  });
  
  it('should list a SINGLE player on /api/<name> GET', done => {
    chai.request(server)
      .get('/api/Jane%20Doe')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });

  it('should update a SINGLE player on /api/<name> PUT', done => {
    chai.request(server)
      .put('/api/Jane%20Doe')
      .send({ roll: 10 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('score').eql(10);
        res.body.should.have.property('frames').with.length(1);
        res.body.should.have.property('onFrame').eql(2);
        res.body.should.have.property('gameOver').eql(false);
        done();
      });
  });

  it('should delete a SINGLE player on /api/<name> DELETE', done => {
    chai.request(server)
      .delete('/api/Jane%20Doe')
      .end((err, res) => {
        res.should.have.status(204);

        chai.request(server)
          .get('/api/Jane%20Doe')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('string');
            done();
          });
      });
  });
});

describe('Bowling API: Scoring', () => {
  beforeEach((done) => {
    chai.request(server)
      .post('/api')
      .send({ name: 'Jane Doe' })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('name');
        res.body.should.have.property('score').eql(0);
        res.body.should.have.property('frames').with.length(0);
        res.body.should.have.property('onFrame').eql(1);
        res.body.should.have.property('gameOver').eql(false);
        done();
      });    
  });

  afterEach((done) => {
    chai.request(server)
      .delete('/api/Jane%20Doe')
      .end((err, res) => {
        res.should.have.status(204);

        chai.request(server)
          .get('/api/Jane%20Doe')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('string');
            done();
          });
      });
  });
  
  it('should have score 0 if all updates are 0', done => {
    chai.request(server)
      .put('/api/Jane%20Doe')
      .send({ roll: 0 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('score').eql(0);
        res.body.should.have.property('frames').with.length(1);
        res.body.should.have.property('onFrame').eql(1);
        res.body.should.have.property('gameOver').eql(false);
        done();
      });
  });
})