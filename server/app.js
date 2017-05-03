const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/battleship');

let Battleship = require('./models/battleship');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));

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

// Create game: create a new 10x10 gameboard of 0s
app.post('/create-game', (req, res) => {
  let game = new Battleship({board: Array(100).fill(0), sunk: []});
  game.save().then(() => {
    Battleship.find().then((result) => {
      res.send(result[result.length - 1]);
    });
  });
});

// Make move: take shots to sink ships
app.post('/make-move', (req, res) => {
  Battleship.find().then((result) => {
    let board = result[result.length - 1].board.slice();
    let sunk = result[result.length - 1].sunk.slice();
    let i = req.body.shot;
    let msg;
    let shot;
    if (board[i] === 0) {
      msg = 'miss';
      board[i] = 7;
      shot = 7;
    } else if (board[i] > 0 && board[i] < 6) {
      msg = 'hit';
      board[i] = 8;
      shot = 8;
      if (board.reduce((a, e, k) => (e === 1) ? a.concat(k) : a, []).length === 0 && sunk.indexOf(1) === -1) {
        msg = 'sunk';
        sunk.push(1);
        board = board.map((item) => item === 8 ? 9 : item);
        shot = 9;
      }
      else if (board.reduce((a, e, k) => (e === 2) ? a.concat(k) : a, []).length === 0 && sunk.indexOf(2) === -1) {
        msg = 'sunk';
        sunk.push(2);
        board = board.map((item) => item === 8 ? 9 : item);
        shot = 9;
      }
      else if (board.reduce((a, e, k) => (e === 3) ? a.concat(k) : a, []).length === 0 && sunk.indexOf(3) === -1) {
        msg = 'sunk';
        sunk.push(3);
        board = board.map((item) => item === 8 ? 9 : item);
        shot = 9;
      }
      else if (board.reduce((a, e, k) => (e === 4) ? a.concat(k) : a, []).length === 0 && sunk.indexOf(4) === -1) {
        msg = 'sunk';
        sunk.push(4);
        board = board.map((item) => item === 8 ? 9 : item);
        shot = 9;
      }
      else if (board.reduce((a, e, k) => (e === 5) ? a.concat(k) : a, []).length === 0 && sunk.indexOf(5) === -1) {
        msg = 'sunk';
        sunk.push(5);
        board = board.map((item) => item === 8 ? 9 : item);
        shot = 9;
      }
      if (board.reduce((a, e, k) => (e === 1) ? a.concat(k) : a, []).length === 0 &&
          board.reduce((a, e, k) => (e === 2) ? a.concat(k) : a, []).length === 0 &&
          board.reduce((a, e, k) => (e === 3) ? a.concat(k) : a, []).length === 0 &&
          board.reduce((a, e, k) => (e === 4) ? a.concat(k) : a, []).length === 0 &&
          board.reduce((a, e, k) => (e === 5) ? a.concat(k) : a, []).length === 0) {
        msg = 'won';
        board = board.map((item) => item === 8 ? 9 : item);
        shot = 10;
      }
    }
    let game = new Battleship({board: board, sunk: sunk});
    game.save().then(() => {
      Battleship.find().then((result) => {
        let move = {
          sunk: sunk,
          shot: shot,
          msg: msg,
          board: result[result.length - 1].board
        };
        res.send(move);
      });
    });
  });
});

module.exports = app;
