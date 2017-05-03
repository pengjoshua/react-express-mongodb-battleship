import React, { Component } from 'react';
import { Grid, Col, Row, Button } from 'react-bootstrap';
import axios from 'axios';
import Board from './components/Board';
import Ships from './components/Ships';
import Header from './components/Header';
import './style.css';

const carrierlen = 5;
const battleshiplen = 4;
const cruiserlen = 3;
const submarinelen = 2;
const destroyerlen = 2;

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        won: false,
        squares: Array(100).fill(0),
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
    if (this.state.newGame) {
      this.createGame();
      // console.log(this.state);
    }
  }

  createGame() {
    axios.post('/create-game')
    .then((response) => {
      this.setState({
        newGame: false,
        history: [{
          won: false,
          sunk: response.data.sunk,
          squares: response.data.board,
          allShips: [],
          shipPlaced: {
            carrier: false,
            battleship: false,
            cruiser: false,
            submarine: false,
            destroyer: false
          }
        }]
      }, () => {
        // console.log(this.state);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  handleCarrierClick(e) {
    let vertical = (this.state.shipSelected.carrier) ? !this.state.vertical : true;
    this.setState({shipSelected: {carrier: true, battleship: false, cruiser: false, submarine: false, destroyer: false}, vertical: vertical});
  }

  handleBattleshipClick(e) {
    let vertical = (this.state.shipSelected.battleship) ? !this.state.vertical : true;
    this.setState({shipSelected: {carrier: false, battleship: true, cruiser: false, submarine: false, destroyer: false}, vertical: vertical});
  }

  handleCruiserClick(e) {
    let vertical = (this.state.shipSelected.cruiser) ? !this.state.vertical : true;
    this.setState({shipSelected: {carrier: false, battleship: false, cruiser: true, submarine: false, destroyer: false}, vertical: vertical});
  }

  handleSubmarineClick(e) {
    let vertical = (this.state.shipSelected.submarine) ? !this.state.vertical : true;
    this.setState({shipSelected: {carrier: false, battleship: false, cruiser: false, submarine: true, destroyer: false}, vertical: vertical});
  }

  handleDestroyerClick(e) {
    let vertical = (this.state.shipSelected.destroyer) ? !this.state.vertical : true;
    this.setState({shipSelected: {carrier: false, battleship: false, cruiser: false, submarine: false, destroyer: true}, vertical: vertical});
  }

  placeShips(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const sunk = current.sunk.slice();
    let won = current.won;
    let allShips = current.allShips;
    let carrier = [];
    let battleship = [];
    let cruiser = [];
    let submarine = [];
    let destroyer = [];
    let carrierPlaced = current.shipPlaced.carrier;
    let battleshipPlaced = current.shipPlaced.battleship;
    let cruiserPlaced = current.shipPlaced.cruiser;
    let submarinePlaced = current.shipPlaced.submarine;
    let destroyerPlaced = current.shipPlaced.destroyer;

    axios.get('/get-game')
    .then((response) => {
      if (this.state.shipSelected.carrier && !carrierPlaced) {
        if (this.state.vertical && toMatrix(i).row + carrierlen < 10) {
          for (let k = 0; k < carrierlen; k++) {
            if (allShips.indexOf(i + (k * 10)) !== -1) {
              carrier = [];
              break;
            }
            else carrier.push(i + (k * 10));
          }
        }
        else if (!this.state.vertical && toMatrix(i).col + carrierlen <= 10) {
          for (let k = 0; k < carrierlen; k++) {
            if (allShips.indexOf(i + k) !== -1) {
              carrier = [];
              break;
            }
            else carrier.push(i + k);
          }
        }
        if (carrier.length > 0) {
          carrier.forEach((pos) => {
            squares[pos] = 1;
            allShips.push(pos);
          });
          carrierPlaced = true;
        }
      } else if (this.state.shipSelected.battleship && !battleshipPlaced) {
        if (this.state.vertical && toMatrix(i).row + battleshiplen <= 10) {
          for (let k = 0; k < battleshiplen; k++) {
            if (allShips.indexOf(i + (k * 10)) !== -1) {
              battleship = [];
              break;
            }
            else battleship.push(i + (k * 10));
          }
        }
        else if (!this.state.vertical && toMatrix(i).col + battleshiplen <= 10) {
          for (let k = 0; k < battleshiplen; k++) {
            if (allShips.indexOf(i + k) !== -1) {
              battleship = [];
              break;
            }
            else battleship.push(i + k);
          }
        }
        if (battleship.length > 0) {
          battleship.forEach((pos) => {
            squares[pos] = 2;
            allShips.push(pos);
          });
          battleshipPlaced = true;
        }
      } else if (this.state.shipSelected.cruiser && !cruiserPlaced) {
        if (this.state.vertical && toMatrix(i).row + cruiserlen <= 10) {
          for (let k = 0; k < cruiserlen; k++) {
            if (allShips.indexOf(i + (k * 10)) !== -1) {
              cruiser = [];
              break;
            }
            else cruiser.push(i + (k * 10));
          }
        }
        else if (!this.state.vertical && toMatrix(i).col + cruiserlen <= 10) {
          for (let k = 0; k < cruiserlen; k++) {
            if (allShips.indexOf(i + k) !== -1) {
              cruiser = [];
              break;
            }
            else cruiser.push(i + k);
          }
        }
        if (cruiser.length > 0) {
          cruiser.forEach((pos) => {
            squares[pos] = 3;
            allShips.push(pos);
          });
          cruiserPlaced = true;
        }
      } else if (this.state.shipSelected.submarine && !submarinePlaced) {
        if (this.state.vertical && toMatrix(i).row + submarinelen <= 10) {
          for (let k = 0; k < submarinelen; k++) {
            if (allShips.indexOf(i + (k * 10)) !== -1) {
              submarine = [];
              break;
            }
            else submarine.push(i + (k * 10));
          }
        }
        else if (!this.state.vertical && toMatrix(i).col + submarinelen <= 10) {
          for (let k = 0; k < submarinelen; k++) {
            if (allShips.indexOf(i + k) !== -1) {
              submarine = [];
              break;
            }
            else submarine.push(i + k);
          }
        }
        if (submarine.length > 0) {
          submarine.forEach((pos) => {
            squares[pos] = 4;
            allShips.push(pos);
          });
          submarinePlaced = true;
        }
      } else if (this.state.shipSelected.destroyer && !destroyerPlaced) {
        if (this.state.vertical && toMatrix(i).row + destroyerlen <= 10) {
          for (let k = 0; k < destroyerlen; k++) {
            if (allShips.indexOf(i + (k * 10)) !== -1) {
              destroyer = [];
              break;
            }
            else destroyer.push(i + (k * 10));
          }
        }
        else if (!this.state.vertical && toMatrix(i).col + destroyerlen <= 10) {
          for (let k = 0; k < destroyerlen; k++) {
            if (allShips.indexOf(i + k) !== -1) {
              destroyer = [];
              break;
            }
            else destroyer.push(i + k);
          }
        }
        if (destroyer.length > 0) {
          destroyer.forEach((pos) => {
            squares[pos] = 5;
            allShips.push(pos);
          });
          destroyerPlaced = true;
        }
      }
      this.setState({
        ships: {
          carrier: carrier,
          battleship: battleship,
          cruiser: cruiser,
          submarine: submarine,
          destroyer: destroyer
        },
        history: history.concat([{
          won: won,
          sunk: sunk,
          squares: squares,
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
        // console.log(this.state);
        this.saveGame(i);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

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
    axios.post('/make-move', {shot: i})
    .then((response) => {
      // console.log(response.data);
      console.log(response.data.msg);
      won = (response.data.msg === 'won') ? true : false;
      this.setState({
        history: history.concat([{
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

  saveGame(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const sunk = current.sunk.slice();
    axios.post('/save-game', {board: squares, sunk: sunk})
    .then((response) => {

    })
    .catch((error) => {
      console.log(error);
    });
  }

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
    if (current.allShipsPlaced && !current.won) {
      this.makeMove(i);
    } else if (!current.allShipsPlaced && !current.won) {
      this.placeShips(i);
    } else if (this.state.won) {
      this.setState({
        history: history.concat([{
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
      }, () => {

      })
    }
  }

  jumpTo(step) {
    this.setState({stepNumber: step});
  }

  handleStartClick() {
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
    if (current.allShips.length === carrierlen + battleshiplen + cruiserlen + submarinelen + destroyerlen) {
      this.setState({
        history: history.concat([{
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
        won: false,
        squares: Array(100).fill(0),
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
    }, () => {
      this.createGame();
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    let phase;
    if (current.allShipsPlaced && !current.won) phase = <div><h5>Take shots to sink ships!</h5></div>;
    else if (!current.allShipsPlaced && !current.won) phase = (
      <div>
        <h5>Place ships on board</h5>
        <p>The highlighted cell indicates the topmost/leftmost ship cell</p>
      </div>
    );
    else if (current.won) phase = <div><h5>Congratulations! You have sunk all the ships!</h5></div>;

    let orientation = (this.state.vertical && !current.allShipsPlaced) ?
      <div>
        <h5>Ship orientation: Vertical</h5>
        <p>Click ship to select ship and toggle orientation</p>
      </div> :
      <div>
        <h5>Ship orientation: Horizontal</h5>
        <p>Click ship to select ship and toggle orientation</p>
      </div>;

    let startButton = (current.won) ?
    <div>
      <p>To clear the board and restart, press Restart!</p>
      <Button className="start" onClick={() => this.handleRestartClick()}>Restart</Button>
    </div> :
    <div>
      <p>When you have finished placing ships on the board, press Start!</p>
      <Button className="start" onClick={() => this.handleStartClick()}>Start</Button>
    </div>

    const moves = history.map((step, move) => {
      const desc = move ? 'Move #' + move : 'Game start';
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
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
                <br />
                <h6>Move History</h6>
                <ol>{moves}</ol>
              </div>
            </Col>
            <Col xs={6} md={6} lg={6}>
              {orientation}
              <div className="game-board">
                <Ships
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

// function toArray(i, j) {
//   return (i * 10) + j;
// }
