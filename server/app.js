const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/battleship');

let Battleship = require('./models/battleship');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));

// Create game: create a new 100 element array gameboard of 0s
app.post('/create-board', (req, res) => {

  // /* for taking in a 2D array */
  // let game = new Battleship({board: [].concat.apply([], req.body.board), sunk: []});

  let game = new Battleship({board: Array(100).fill(0), sunk: []});
  game.save().then(() => {
    Battleship.find().then((result) => {
      res.send(result[result.length - 1]);
    });
  });
});

// Create game: take a 2D initialization array and create gameboard
// requires the following from the request body:
// ships: 2D array of ship coordinate pairs (for 10x10 array) or 1D array of indices (for 1x100 array)
// lens: array of ship lengths corresponding to the ships array
// verts: array of ship orientations (as booleans: vertical = true) corresponding to the ships array
// board (optional): will create a new blank gameboard if an existing gameboard is not provided
app.post('/create-game', (req, res) => {
  let ships = req.body.ships;
  let lens = req.body.lens;
  let values = req.body.values;
  let verts = req.body.verts;
  let board = (req.body.board) ? req.body.board : Array(100).fill(0);
  if (!req.body.ships || !req.body.lens || !req.body.verts || !req.body.values) return res.status(400).send('missing inputs');
  if (res.headersSent) return;
  if (ships[0].constructor !== Array) return res.status(400).send('ships input not a 2D array');
  if (!Array.isArray(lens)) return res.status(400).send('lens input not an array');
  if (!Array.isArray(verts)) return res.status(400).send('verts input not an array');
  if (!Array.isArray(values)) return res.status(400).send('values input not an array');
  if (ships.length !== lens.length || ships.length !== verts.length || ships.length !== ships.length || ships.length !== values.length) return res.status(400).send('mismatched inputs');

  ships.forEach((ship, i) => {
    if (toIndex(ship) < 0 || toIndex(ship) > 99) return res.status(400).send('ship off board');
    if (lens[i] < 1 || lens[i] > 10) return res.status(400).send('invalid ship length');
    if (typeof verts[i] !== 'boolean') return res.status(400).send('invalid ship orientation');
    for (let k = 0; k < lens[i]; k++) {
      if (verts[i]) {
        if (ship[0] + k > 9) return res.status(400).send('vertically oriented ship does not fully fit on board');
        if (board[toIndex([ship[0] + k, ship[1]])] !== 0) return res.status(400).send('cell contains ship');
        board[toIndex([ship[0] + k, ship[1]])] = values[i];
      } else if (!verts[i]) {
        if (ship[1] + k > 9) return res.status(400).send('horizontally oriented ship does not fully fit on board');
        if (board[toIndex(ship) + k] !== 0) return res.status(400).send('cell contains ship');
        board[toIndex(ship) + k] = values[i];
      }
    }
  });
  if (res.headersSent) return;
  let game = new Battleship({board: board, sunk: []});
  game.save().then(() => {
    Battleship.find().then((result) => {
      res.send(result[result.length - 1]);
    });
  });
});

// Get game: retrieve the current gameboard
app.get('/get-game', (req, res) => {
  Battleship.find().then((result) => {
    res.send(result[result.length - 1]);
  });
});

// Save game: save the current state of the gameboard
app.post('/save-game', (req, res) => {
  let game = new Battleship({board: req.body.board, sunk: req.body.sunk});
  game.save().then(() => {
    Battleship.find().then((result) => {
      res.send(result[result.length - 1]);
    });
  });
});

// Make move: take shots to sink ships
// evaluates shots, returns a msg of 'hit', 'miss', 'sunk', or 'won'
// also returns the current gameboard, shot value, and sunk array (sunk ships)
// value:
// 0: water
// 1 - 10: ships
// 77: miss
// 11 - 20: hit
// 88: sunk
// 99: won
app.post('/make-move', (req, res) => {
  Battleship.find().then((result) => {
    let board = result[result.length - 1].board.slice();
    let sunk = result[result.length - 1].sunk.slice();
    if (!req.body.shot) return res.status(400).send('missing shot coordinates');
    let i;
    if (req.body.shot.length === 2) {
      if (req.body.shot[0] < 0 || req.body.shot[0] > 99 || req.body.shot[1] < 0 || req.body.shot[1] > 99) return res.status(400).send('shot off of board');
      i = toIndex(req.body.shot);
    } else if (req.body.shot.length === 1) {
      if (req.body.shot[0] < 0 || req.body.shot[0] > 99) return res.status(400).send('shot off of board');
      i = req.body.shot[0];
    } else if (!Array.isArray(req.body.shot)) return res.status(400).send('invalid shot input');

    let msg;
    let value;
    let ships = [...Array(10)].map((v, k) => k + 1);
    if (board[i] === 0) {
      msg = 'miss';
      board[i] = 77;
      value = 77;
    } else if (board[i] > 0 && board[i] < 11) {
      msg = 'hit';
      const lastHit = board[i];
      board[i] += 10;
      value = board[i];
      if (sunk.indexOf(lastHit) === -1 && board.indexOf(lastHit) === -1) {
        msg = 'sunk';
        sunk.push(lastHit);
        board = board.map((item) => item === (lastHit + 10) ? 88 : item);
        value = 88;
      }
      if (board.reduce((a, e, k) => (e !== 0 && e !== 77 && e !== 88) ? a.concat(k) : a, []).length === 0){
        msg = 'won';
        board = board.map((item) => item === 88 ? 99 : item);
        value = 99;
      }
    }
    if (res.headersSent) return;
    let game = new Battleship({board: board, sunk: sunk});
    game.save().then(() => {
      Battleship.find().then((result) => {
        let move = {
          sunk: sunk,
          value: value,
          msg: msg,
          board: result[result.length - 1].board
        };
        res.send(move);
      });
    });
  });
});

// helper functions to convert shots between a 10x10 array coordinate pair and a 1x100 array index
function toMatrix(i) {
  return {
    row: Math.floor(i / 10),
    col: i % 10
  };
}

function toIndex(i) {
  return (i[0] * 10) + i[1];
}

module.exports = app;
