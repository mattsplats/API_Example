'use strict';

process.env.NODE_ENV = 'test';

const chai   = require('chai'),
      server = require('../server'),
      should = chai.should();

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

  it('should add a roll to a SINGLE player on /api/<name> POST', () => {
    return chai.request(server)
      .post('/api/Jane%20Doe')
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

  it('should reset the score of a SINGLE player on /api/<name> PUT', () => {
    return chai.request(server)
      .put('/api/Jane%20Doe')
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('score').eql(0);
        res.body.should.have.property('frames').with.length(0);
        res.body.should.have.property('onFrame').eql(1);
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

  it('should NOT allow rolls > 10', () => {
    return chai.request(server).post('/api/Jane%20Doe').send({ roll: 11 })
      .catch(err => {
        err.response.statusCode.should.eql(400);
      });
  });

  it('should NOT allow rolls < 0', () => {
    return chai.request(server).post('/api/Jane%20Doe').send({ roll: -1 })
      .catch(err => {
        err.response.statusCode.should.eql(400);
      });
  });

  it('should NOT allow frames of score > 10', () => {
    return chai.request(server).post('/api/Jane%20Doe').send({ roll: 8 })
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 3 }))
      .catch(err => {
        err.response.statusCode.should.eql(400);
      });
  });
  
  it('should have score 0 if all rolls are 0', () => {
    return chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 })
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('score').eql(0);
        res.body.should.have.property('frames').with.length(10);
        res.body.should.have.property('onFrame').eql(10);
        res.body.should.have.property('gameOver').eql(true);
      });
  });

  it('should have score 150 if all rolls are 5', () => {
    return chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 })
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('score').eql(150);
        res.body.should.have.property('frames').with.length(10);
        res.body.frames.should.include.something.that.deep.equals({ roll1: 5, roll2: '/', score: 120 });
        res.body.should.have.property('onFrame').eql(10);
        res.body.should.have.property('gameOver').eql(true);
      });
  });

  it('should have score 300 if all rolls are 10', () => {
    return chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 })
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
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

  it('should have score 148 on test game [3,1,7,3,6,4,4,0,0,10,10,10,10,5,2,8,2,1]', () => {
    return chai.request(server).post('/api/Jane%20Doe').send({ roll: 3 })
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 1 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 7 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 3 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 6 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 4 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 4 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 2 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 8 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 2 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 1 }))
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('score').eql(148);
        res.body.should.have.property('frames').with.length(10);
        res.body.frames.should.include.something.that.deep.equals({ roll1: 0, roll2: '/', score: 58 });
        res.body.frames.should.include.something.that.deep.equals({ roll1: 5, roll2: 2, score: 137 });
        res.body.should.have.property('onFrame').eql(10);
        res.body.should.have.property('gameOver').eql(true);
      });
  });

  it('should have score 152 on test game [10,10,10,9,0,0,10,5,4,4,3,3,7,7,2,2,8,1]', () => {
    return chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 })
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 9 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 4 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 4 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 3 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 3 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 7 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 7 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 2 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 2 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 6 }))
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('score').eql(152);
        res.body.should.have.property('frames').with.length(10);
        res.body.frames.should.include.something.that.deep.equals({ roll1: 'X', score: 78 });
        res.body.frames.should.include.something.that.deep.equals({ roll1: 5, roll2: 4, score: 111 });
        res.body.should.have.property('onFrame').eql(10);
        res.body.should.have.property('gameOver').eql(true);
      });
  });

  it('should have score 138 on test game [7,2,10,5,5,2,8,4,2,2,6,5,4,9,1,10,4,6,10]', () => {
    return chai.request(server).post('/api/Jane%20Doe').send({ roll: 7 })
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 2 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 2 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 8 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 4 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 2 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 2 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 6 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 4 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 9 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 1 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 4 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 6 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('score').eql(138);
        res.body.should.have.property('frames').with.length(10);
        res.body.frames.should.include.something.that.deep.equals({ roll1: 'X', score: 29 });
        res.body.frames.should.include.something.that.deep.equals({ roll1: 5, roll2: 4, score: 78 });
        res.body.should.have.property('onFrame').eql(10);
        res.body.should.have.property('gameOver').eql(true);
      });
  });

  it('should have score 70 on test game [2,2,2,1,0,7,4,5,9,1,0,4,10,5,0,1,8,0,4]', () => {
    return chai.request(server).post('/api/Jane%20Doe').send({ roll: 2 })
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 2 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 2 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 1 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 7 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 4 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 9 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 1 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 4 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 1 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 8 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 4 }))
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('score').eql(70);
        res.body.should.have.property('frames').with.length(10);
        res.body.frames.should.include.something.that.deep.equals({ roll1: 'X', score: 52 });
        res.body.frames.should.include.something.that.deep.equals({ roll1: 9, roll2: '/', score: 33 });
        res.body.should.have.property('onFrame').eql(10);
        res.body.should.have.property('gameOver').eql(true);
      });
  });

  it('should NOT further update the score if the game is over', () => {
    return chai.request(server).post('/api/Jane%20Doe').send({ roll: 2 })
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 2 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 2 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 1 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 7 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 4 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 9 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 1 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 4 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 10 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 5 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 1 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 8 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 0 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 4 }))
      .then(() => chai.request(server).post('/api/Jane%20Doe').send({ roll: 4 }))  // Extra roll here
      .catch(err => {
        err.response.statusCode.should.eql(400);
      });
  });
})

// Just in case a promise rejection was missed
process.on('unhandledRejection', reason => {
  console.error(reason);
  process.exit(1);
});