import React, { Component } from 'react';
import { Grid, Col, Row, Button } from 'react-bootstrap';
import axios from 'axios';
import Board from './components/Board';
import Ships from './components/Ships';
import Header from './components/Header';
import './style.css';

// constants for ship length
const carrierlen = 6;
const battleshiplen = 5;
const cruiserlen = 4;
const submarinelen = 3;
const destroyerlen = 2;

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newGame: true,
      shipSelected: {
        carrier: false,
        battleship: false,
        cruiser: false,
        submarine: false,
        destroyer: false
      },
      ships: {
        carrier: [],
        battleship: [],
        cruiser: [],
        submarine: [],
        destroyer: []
      },
      vertical: true,
      history: [{
        msg: '',
        won: false,
        squares: Array(100).fill(0),
        allShipsPlaced: false,
        allShips: [],
        shipPlaced: {
          carrier: false,
          battleship: false,
          cruiser: false,
          submarine: false,
          destroyer: false
        }
      }],
      stepNumber: 0,
    };
  }

  componentDidMount() {
    if (this.state.newGame) this.createBoard();
  }

  // create a new 1x100 gameboard of 0s, can be modified to use a 10x10 array
  createBoard() {

    // /* to use a 10x10 array instead of 1x100 array */
    // const board = Array(10).fill(Array(10).fill(0));
    // axios.post('/create-board', {board: board})

    axios.post('/create-board')
    .then((response) => {
      this.setState({
        newGame: false,
        history: [{
          msg: '',
          won: false,
          sunk: response.data.sunk,
          squares: response.data.board,
          allShipsPlaced: false,
          allShips: [],
          shipPlaced: {
            carrier: false,
            battleship: false,
            cruiser: false,
            submarine: false,
            destroyer: false
          }
        }]
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // click handlers: clicking on the ships on the right to select a ship and toggle orientation
  handleCarrierClick(e) {
    let vertical = (this.state.shipSelected.carrier) ? !this.state.vertical : this.state.vertical;
    this.setState({shipSelected: {carrier: true, battleship: false, cruiser: false, submarine: false, destroyer: false}, vertical: vertical});
  }

  handleBattleshipClick(e) {
    let vertical = (this.state.shipSelected.battleship) ? !this.state.vertical : this.state.vertical;
    this.setState({shipSelected: {carrier: false, battleship: true, cruiser: false, submarine: false, destroyer: false}, vertical: vertical});
  }

  handleCruiserClick(e) {
    let vertical = (this.state.shipSelected.cruiser) ? !this.state.vertical : this.state.vertical;
    this.setState({shipSelected: {carrier: false, battleship: false, cruiser: true, submarine: false, destroyer: false}, vertical: vertical});
  }

  handleSubmarineClick(e) {
    let vertical = (this.state.shipSelected.submarine) ? !this.state.vertical : this.state.vertical;
    this.setState({shipSelected: {carrier: false, battleship: false, cruiser: false, submarine: true, destroyer: false}, vertical: vertical});
  }

  handleDestroyerClick(e) {
    let vertical = (this.state.shipSelected.destroyer) ? !this.state.vertical : this.state.vertical;
    this.setState({shipSelected: {carrier: false, battleship: false, cruiser: false, submarine: false, destroyer: true}, vertical: vertical});
  }

  // create a new gameboard or use an existing gameboard and evaluate new ship placements
  createGame(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let won = current.won;
    let allShips = current.allShips;
    let allShipsPlaced;
    let carrierPlaced = current.shipPlaced.carrier;
    let battleshipPlaced = current.shipPlaced.battleship;
    let cruiserPlaced = current.shipPlaced.cruiser;
    let submarinePlaced = current.shipPlaced.submarine;
    let destroyerPlaced = current.shipPlaced.destroyer;
    let lastShipPlaced;
    let ships = [];
    let lens = [];
    let verts = [];
    let values = [];
    if (this.state.shipSelected.carrier && !carrierPlaced) {
      ships.push([toMatrix(i).row, toMatrix(i).col]);
      lens.push(carrierlen);
      verts.push(this.state.vertical);
      values.push(1);
      lastShipPlaced = 'carrier';
    } else if (this.state.shipSelected.battleship && !battleshipPlaced) {
      ships.push([toMatrix(i).row, toMatrix(i).col]);
      lens.push(battleshiplen);
      verts.push(this.state.vertical);
      values.push(2);
      lastShipPlaced = 'battleship';
    } else if (this.state.shipSelected.cruiser && !cruiserPlaced) {
      ships.push([toMatrix(i).row, toMatrix(i).col]);
      lens.push(cruiserlen);
      verts.push(this.state.vertical);
      values.push(3);
      lastShipPlaced = 'cruiser';
    } else if (this.state.shipSelected.submarine && !submarinePlaced) {
      ships.push([toMatrix(i).row, toMatrix(i).col]);
      lens.push(submarinelen);
      verts.push(this.state.vertical);
      values.push(4);
      lastShipPlaced = 'submarine';
    } else if (this.state.shipSelected.destroyer && !destroyerPlaced) {
      ships.push([toMatrix(i).row, toMatrix(i).col]);
      lens.push(destroyerlen);
      verts.push(this.state.vertical);
      values.push(5);
      lastShipPlaced = 'destroyer';
    }
    axios.post('/create-game', {ships: ships, lens: lens, verts: verts, values: values, board: squares})
    .then((response) => {
      if (response.status !== 400 && lastShipPlaced === 'carrier') carrierPlaced = true;
      if (response.status !== 400 && lastShipPlaced === 'battleship') battleshipPlaced = true;
      if (response.status !== 400 && lastShipPlaced === 'cruiser') cruiserPlaced = true;
      if (response.status !== 400 && lastShipPlaced === 'submarine') submarinePlaced = true;
      if (response.status !== 400 && lastShipPlaced === 'destroyer') destroyerPlaced = true;
      allShipsPlaced = (carrierPlaced && battleshipPlaced && cruiserPlaced && submarinePlaced && destroyerPlaced) ? true : false;
      this.setState({
        history: history.concat([{
          msg: current.msg,
          won: won,
          sunk: response.data.sunk,
          squares: response.data.board,
          allShips: allShips,
          allShipsPlaced: allShipsPlaced,
          shipPlaced: {
            carrier: carrierPlaced,
            battleship: battleshipPlaced,
            cruiser: cruiserPlaced,
            submarine: submarinePlaced,
            destroyer: destroyerPlaced
          }
        }]),
        stepNumber: history.length,
      }, () => {
        this.saveGame(i);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // evaluates shots, returns a msg of 'hit', 'miss', 'sunk', or 'won'
  // also returns the current gameboard, shot value, and sunk array (sunk ships)
  // value:
  // 0: water
  // 1 - 10: ships
  // 77: miss
  // 11 - 20: hit
  // 88: sunk
  // 99: won
  makeMove(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    let won;
    let allShips = current.allShips;
    let allShipsPlaced = current.allShipsPlaced;
    let carrierPlaced = current.shipPlaced.carrier;
    let battleshipPlaced = current.shipPlaced.battleship;
    let cruiserPlaced = current.shipPlaced.cruiser;
    let submarinePlaced = current.shipPlaced.submarine;
    let destroyerPlaced = current.shipPlaced.destroyer;
    axios.post('/make-move', {shot: [i]})
    .then((response) => {
      console.log(response.data.msg);
      won = (response.data.msg === 'won') ? true : false;
      this.setState({
        history: history.concat([{
          msg: response.data.msg,
          won: won,
          sunk: response.data.sunk,
          squares: response.data.board,
          allShipsPlaced: allShipsPlaced,
          allShips: allShips,
          shipPlaced: {
            carrier: carrierPlaced,
            battleship: battleshipPlaced,
            cruiser: cruiserPlaced,
            submarine: submarinePlaced,
            destroyer: destroyerPlaced
          }
        }]),
        stepNumber: history.length,
      }, () => {
        this.saveGame(i);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // save current gameboard
  saveGame(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const sunk = current.sunk.slice();
    let allShips = current.allShips;
    let won = current.won;
    let allShipsPlaced = current.allShipsPlaced;
    let carrierPlaced = current.shipPlaced.carrier;
    let battleshipPlaced = current.shipPlaced.battleship;
    let cruiserPlaced = current.shipPlaced.cruiser;
    let submarinePlaced = current.shipPlaced.submarine;
    let destroyerPlaced = current.shipPlaced.destroyer;
    axios.post('/save-game', {board: squares, sunk: sunk})
    .then((response) => {
      this.setState({
        history: history.concat([{
          msg: current.msg,
          won: won,
          sunk: response.data.sunk,
          squares: response.data.board,
          allShipsPlaced: allShipsPlaced,
          allShips: allShips,
          shipPlaced: {
            carrier: carrierPlaced,
            battleship: battleshipPlaced,
            cruiser: cruiserPlaced,
            submarine: submarinePlaced,
            destroyer: destroyerPlaced
          }
        }]),
        stepNumber: history.length,
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // handles all mouse clicks when placing ships and shooting ships
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    let allShips = current.allShips;
    let won = current.won;
    let sunk = current.sunk.slice();
    let squares = current.squares.slice();
    let carrierPlaced = current.shipPlaced.carrier;
    let battleshipPlaced = current.shipPlaced.battleship;
    let cruiserPlaced = current.shipPlaced.cruiser;
    let submarinePlaced = current.shipPlaced.submarine;
    let destroyerPlaced = current.shipPlaced.destroyer;
    if (current.allShipsPlaced && !current.won && Object.values(this.state.shipSelected).some(x => x === true)) {
      this.makeMove(i);
    } else if (!current.allShipsPlaced && !current.won && Object.values(this.state.shipSelected).some(x => x === true)) {
      this.createGame(i);
    } else if (this.state.won) {
      this.setState({
        history: history.concat([{
          msg: current.msg,
          won: won,
          sunk: sunk,
          squares: squares,
          allShipsPlaced: true,
          allShips: allShips,
          shipPlaced: {
            carrier: carrierPlaced,
            battleship: battleshipPlaced,
            cruiser: cruiserPlaced,
            submarine: submarinePlaced,
            destroyer: destroyerPlaced
          }
        }]),
        stepNumber: history.length,
      });
    }
  }

  // reverts state back in time to a specific move number
  jumpTo(step) {
    this.setState({stepNumber: step});
  }

  // reinitialize app and restart game
  handleRestartClick() {
    this.setState({
      newGame: true,
      allShipsPlaced: false,
      shipSelected: {
        carrier: false,
        battleship: false,
        cruiser: false,
        submarine: false,
        destroyer: false
      },
      ships: {
        carrier: [],
        battleship: [],
        cruiser: [],
        submarine: [],
        destroyer: []
      },
      vertical: true,
      history: [{
        msg: '',
        won: false,
        squares: Array(100).fill(0),
        allShips: [],
        allShipsPlaced: false,
        shipPlaced: {
          carrier: false,
          battleship: false,
          cruiser: false,
          submarine: false,
          destroyer: false
        }
      }],
      stepNumber: 0,
    }, () => {
      this.createBoard();
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    let phase;
    if (current.allShipsPlaced && !current.won) {
      phase = <div className="shootships"><h5>Take shots to sink ships!</h5></div>;
    } else if (!current.allShipsPlaced && !current.won) {
      phase = (
        <div>
          <h5>Place ships on board</h5>
          <p>Place ship from the top (vertical) or left (horizontal) cell</p>
        </div>
      );
    } else if (current.won) phase = <div className="congrats"><h5>Congratulations! You have sunk all the ships!</h5></div>;

    let orientation = (this.state.vertical && !current.allShipsPlaced) ?
      <div>
        <h5>Ship orientation: <strong>vertical</strong></h5>
        <p>Click ship to select ship and toggle orientation</p>
      </div> :
      <div>
        <h5>Ship orientation: <strong>horizontal</strong></h5>
        <p>Click ship to select ship and toggle orientation</p>
      </div>;

    let startButton;
    if (current.allShipsPlaced && !current.won) {
      if (current.msg === 'miss') startButton = <div className="labelships"><h5 className="miss-label"><strong>miss</strong></h5></div>;
      else if (current.msg === 'hit') startButton = <div className="labelships"><h5 className="hit-label"><strong>hit</strong></h5></div>;
      else if (current.msg === 'sunk') startButton = <div className="labelships"><h5 className="sunk-label"><strong>sunk</strong></h5></div>;
    } else if (!current.allShipsPlaced && !current.won) {
      startButton = (
        <div className="placeships">
          <p>Battleship will automatically start when all ships placed on the board</p>
        </div>
      );
    } else if (current.won) {
      startButton = (
        <div className="winner">
          <div className="labelships"><h5 className="won-label"><strong>won</strong></h5></div>
          <p>Press Restart to clear the board and start over</p>
          <Button className="restart" onClick={() => this.handleRestartClick()}>Restart</Button>
        </div>
      );
    }

    const moves = history.map((step, move) => {
      const desc = move ? 'Move #' + move : 'Game start';
      return (
        <li key={move}>
          <a id={'move' + move} href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    return (
      <div className="game">
        <Header />
        <Grid>
          <Row>
            <Col xs={6} md={6} lg={6}>
              <div className="game-board">
                {phase}
                <Board
                  allShipsPlaced={current.allShipsPlaced}
                  squares={current.squares}
                  onClick={(i) => this.handleClick(i)}
                />
              </div>
              <div className="game-info">
                <br />
                {startButton}
                <h6><strong>Move History</strong></h6>
                <ol>{moves}</ol>
              </div>
            </Col>
            <Col xs={6} md={6} lg={6}>
              {orientation}
              <div className="game-ships">
                <Ships
                  carrierlen={carrierlen}
                  battleshiplen={battleshiplen}
                  cruiserlen={cruiserlen}
                  submarinelen={submarinelen}
                  destroyerlen={destroyerlen}
                  vertical={this.state.vertical}
                  shipPlaced={current.shipPlaced}
                  shipSelected={this.state.shipSelected}
                  onCarrierClick={() => this.handleCarrierClick()}
                  onBattleshipClick={() => this.handleBattleshipClick()}
                  onCruiserClick={() => this.handleCruiserClick()}
                  onSubmarineClick={() => this.handleSubmarineClick()}
                  onDestroyerClick={() => this.handleDestroyerClick()}
                />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Game;

function toMatrix(i) {
  return {
    row: Math.floor(i / 10),
    col: i % 10
  };
}
