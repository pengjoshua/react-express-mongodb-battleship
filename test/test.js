const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const should = chai.should();
const mocha = require('mocha');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const app = require('../server/app');
const Battleship = require('../server/models/battleship');
const PORT = 3001;
chai.use(require('chai-things'));
chai.use(chaiHttp);

const clearDB = (done) => {
  mongoose.connection.db.dropDatabase(done);
};

describe('Battleship API', () => {
  let server;
  before((done) => {
    if (mongoose.connection.db) return done;
    mongoose.connect('mongodb://localhost/battleship', done);
  });
  beforeEach((done) => {
    server = app.listen(PORT, () => {
      clearDB(done);
      // console.log(`Test server is listening on port ${PORT}!`);
    });
  });
  afterEach(() => {
    server.close();
  });

  describe('create-board', () => {
    it('should return status 200', (done) => {
      chai.request(app)
      .post('/create-board')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
    it('should create a new 100 element array gameboard of 0s', (done) => {
      chai.request(app)
      .post('/create-board')
      .end((err, res) => {
        expect(JSON.stringify(res.body.board)).to.equal(JSON.stringify(Array(100).fill(0)));
        done();
      });
    });
  });

  describe('get-game', () => {
    it('should return status 200', (done) => {
      chai.request(app)
      .get('/get-game')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
    it('after creating a new gameboard, should return the new 100 element array gameboard of 0s', (done) => {
      chai.request(app)
      .post('/create-board')
      .end((err, res) => {
        chai.request(app)
        .get('/get-game')
        .end((err, res) => {
          expect(JSON.stringify(res.body.board)).to.equal(JSON.stringify(Array(100).fill(0)));
          done();
        });
      });
    });
  });

  describe('save-game', () => {
    it('should return status 200', (done) => {
      chai.request(app)
      .post('/save-game')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
    it('should save a new 100 element array gameboard of 0s', (done) => {
      chai.request(app)
      .post('/save-game')
      .send({board: Array(100).fill(0), sunk: []})
      .end((err, res) => {
        expect(JSON.stringify(res.body.board)).to.equal(JSON.stringify(Array(100).fill(0)));
        done();
      });
    });
    it('should save a modified 100 element array gameboard of 2s', (done) => {
      chai.request(app)
      .post('/save-game')
      .send({board: Array(100).fill(2), sunk: []})
      .end((err, res) => {
        expect(JSON.stringify(res.body.board)).to.equal(JSON.stringify(Array(100).fill(2)));
        done();
      });
    });
  });

  describe('create-game', () => {
    it('should return status 200', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[0, 0]], lens: [1], verts: [false]})
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
    it('should return error if missing ships (2D array of ship coordinates) input', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({lens: [1], verts: [false]})
      .end((err, res) => {
        expect(res.error.text).to.equal('missing inputs');
        res.should.have.status(400);
        done();
      });
    });
    it('should return error if missing lens (array of ship lengths) input', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[0, 0]], verts: [false]})
      .end((err, res) => {
        expect(res.error.text).to.equal('missing inputs');
        res.should.have.status(400);
        done();
      });
    });
    it('should return error if missing verts (array of ship orientations) input', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[0, 0]], lens: [1]})
      .end((err, res) => {
        expect(res.error.text).to.equal('missing inputs');
        res.should.have.status(400);
        done();
      });
    });
    it('should return error if ships is not a 2D array', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [0, 1], lens: [1], verts: [false]})
      .end((err, res) => {
        expect(res.error.text).to.equal('ships input not a 2D array');
        res.should.have.status(400);
        done();
      });
    });
    it('should return error if lens is not an array', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[0, 0]], lens: 1, verts: [false]})
      .end((err, res) => {
        expect(res.error.text).to.equal('lens input not an array');
        res.should.have.status(400);
        done();
      });
    });
    it('should return error if verts is not an array', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[0, 0]], lens: [1], verts: 1})
      .end((err, res) => {
        expect(res.error.text).to.equal('verts input not an array');
        res.should.have.status(400);
        done();
      });
    });
    it('should return error if ships, lens, and verts are not the same length', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[0, 0]], lens: [1, 2, 3, 4], verts: [true]})
      .end((err, res) => {
        expect(res.error.text).to.equal('mismatched inputs');
        res.should.have.status(400);
        done();
      });
    });
    it('should return error if ships contains invalid coordinates (not on 10x10 board)', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[0, 100]], lens: [1], verts: [true]})
      .end((err, res) => {
        expect(res.error.text).to.equal('ship off board');
        res.should.have.status(400);
        done();
      });
    });
    it('should return error if lens contains invalid ship lengths (< 1 or > 10)', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[0, 10]], lens: [11], verts: [true]})
      .end((err, res) => {
        expect(res.error.text).to.equal('invalid ship length');
        res.should.have.status(400);
        done();
      });
    });
    it('should return error if verts contains invalid ship orientation (not a boolean)', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[0, 0]], lens: [10], verts: [2]})
      .end((err, res) => {
        expect(res.error.text).to.equal('invalid ship orientation');
        res.should.have.status(400);
        done();
      });
    });
    it('should return error if a portion of the vertically oriented ship is off the board', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[5, 0]], lens: [10], verts: [true]})
      .end((err, res) => {
        expect(res.error.text).to.equal('vertically oriented ship does not fully fit on board');
        res.should.have.status(400);
        done();
      });
    });
    it('should return error if a portion of the horizontally oriented ship is off the board', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[0, 5]], lens: [10], verts: [false]})
      .end((err, res) => {
        expect(res.error.text).to.equal('horizontally oriented ship does not fully fit on board');
        res.should.have.status(400);
        done();
      });
    });
    it('should return error if there is already a ship in one of the cells', (done) => {
      let array = Array(100).fill(1);
      chai.request(app)
      .post('/create-game')
      .send({ships: [[0, 0]], lens: [1], verts: [false], board: array})
      .end((err, res) => {
        expect(res.error.text).to.equal('cell contains ship');
        res.should.have.status(400);
        done();
      });
    });
    it('should create a new 100 element array gameboard of 0s without board input and place ship at (0,0)', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[0, 0]], lens: [1], verts: [true]})
      .end((err, res) => {
        let array = Array(100).fill(0);
        array[0] = 1;
        expect(JSON.stringify(res.body.board)).to.equal(JSON.stringify(array));
        res.should.have.status(200);
        done();
      });
    });
    it('should place 3 vertically oriented submarines (length: 3) at [[0,0],[0,1],[0,2]]', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[0, 0], [0, 1], [0, 2]], lens: [3, 3, 3], verts: [true, true, true]})
      .end((err, res) => {
        let array = Array(100).fill(0);
        let positions = [0, 1, 2, 10, 11, 12, 20, 21, 22];
        array = array.map((e, i) => (positions.indexOf(i) !== -1) ? 3 : 0);
        expect(JSON.stringify(res.body.board)).to.equal(JSON.stringify(array));
        res.should.have.status(200);
        done();
      });
    });
    it('should place 3 horizontally oriented battleships (length: 5) at [[4,4],[5,4],[6,4]]', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[4, 4], [5, 4], [6, 4]], lens: [5, 5, 5], verts: [false, false, false]})
      .end((err, res) => {
        let array = Array(100).fill(0);
        let positions = [44, 45, 46, 47, 48, 54, 55, 56, 57, 58, 64, 65, 66, 67, 68];
        array = array.map((e, i) => (positions.indexOf(i) !== -1) ? 5 : 0);
        expect(JSON.stringify(res.body.board)).to.equal(JSON.stringify(array));
        res.should.have.status(200);
        done();
      });
    });
  });

  describe('make-move', () => {
    it('should return status 200', (done) => {
      chai.request(app)
      .post('/create-board')
      .end((err, res) => {
        chai.request(app)
        .post('/make-move')
        .send({shot: [33, 33]})
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
      });
    });
    it('should return error if shot input is missing', (done) => {
      chai.request(app)
      .post('/create-board')
      .end((err, res) => {
        chai.request(app)
        .post('/make-move')
        .end((err, res) => {
          expect(res.error.text).to.equal('missing shot coordinates');
          res.should.have.status(400);
          done();
        });
      });
    });
    it('should return error if shot coordinates are not an array or a number', (done) => {
      chai.request(app)
      .post('/create-board')
      .end((err, res) => {
        chai.request(app)
        .post('/make-move')
        .send({shot: 'hello'})
        .end((err, res) => {
          expect(res.error.text).to.equal('invalid shot input');
          res.should.have.status(400);
          done();
        });
      });
    });
    it('should return error if shot coordinates (as matrix) are outside the board', (done) => {
      chai.request(app)
      .post('/create-board')
      .end((err, res) => {
        chai.request(app)
        .post('/make-move')
        .send({shot: [111, 111]})
        .end((err, res) => {
          expect(res.error.text).to.equal('shot off of board');
          res.should.have.status(400);
          done();
        });
      });
    });
    it('should return error if shot coordinates (as index) are outside the board', (done) => {
      chai.request(app)
      .post('/create-board')
      .end((err, res) => {
        chai.request(app)
        .post('/make-move')
        .send({shot: 222})
        .end((err, res) => {
          expect(res.error.text).to.equal('shot off of board');
          res.should.have.status(400);
          done();
        });
      });
    });
    it('should return hit if ship was hit', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[4, 4], [5, 4], [6, 4]], lens: [5, 5, 5], verts: [false, false, false]})
      .end((err, res) => {
        chai.request(app)
        .post('/make-move')
        .send({shot: [5, 4]})
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.msg).to.equal('hit');
          done();
        });
      });
    });
    it('should return sunk if all ship cells are hit', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[4, 4], [5, 4], [6, 4]], lens: [3, 2, 4], verts: [false, false, false]})
      .end((err, res) => {
        chai.request(app)
        .post('/make-move')
        .send({shot: [5, 4]})
        .end((err, res) => {
          expect(res.body.msg).to.equal('hit');
          chai.request(app)
          .post('/make-move')
          .send({shot: [5, 5]})
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.msg).to.equal('sunk');
            done();
          });
        });
      });
    });
    it('should return miss if shot missed', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[4, 4], [5, 4], [6, 4]], lens: [5, 5, 5], verts: [false, false, false]})
      .end((err, res) => {
        chai.request(app)
        .post('/make-move')
        .send({shot: [9, 9]})
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.msg).to.equal('miss');
          done();
        });
      });
    });
    it('should return won if all ships are sunk', (done) => {
      chai.request(app)
      .post('/create-game')
      .send({ships: [[4, 4], [5, 4], [6, 4]], lens: [1, 1, 1], verts: [false, false, false]})
      .end((err, res) => {
        chai.request(app)
        .post('/make-move')
        .send({shot: [4, 4]})
        .end((err, res) => {
          chai.request(app)
          .post('/make-move')
          .send({shot: [5, 4]})
          .end((err, res) => {
            chai.request(app)
            .post('/make-move')
            .send({shot: [6, 4]})
            .end((err, res) => {
              res.should.have.status(200);
              expect(res.body.msg).to.equal('won');
              done();
            });
          });
        });
      });
    });
  });
});
