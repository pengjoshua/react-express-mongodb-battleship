let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let battleshipSchema = new Schema({
  sunk: [Number],
	board: [Number]
});

let Battleship = mongoose.model('battleship', battleshipSchema);

module.exports = Battleship;
