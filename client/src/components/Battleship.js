import React from 'react';
import { Button, Row } from 'react-bootstrap';

function Battleship(props) {
  let selected = (props.selected) ? 'selected' : 'normal';
  let ship = (props.vertical) ?
    Array(4).fill(1).map((square, i) => <Row className="battleship" key={i}><Button className={selected} onClick={() => props.onBattleshipClick()}></Button></Row>) :
    Array(4).fill(1).map((square, i) => <Button key={i} className={selected} onClick={() => props.onBattleshipClick()}></Button>);
  return (
    <div>{ship}<br /><br /></div>
  );
}

export default Battleship;
