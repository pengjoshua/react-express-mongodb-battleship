import React from 'react';
import { Button, Row } from 'react-bootstrap';

function Ship(props) {
  let selected = (props.selected) ? 'selected' : 'normal';
  let ship = (props.vertical) ?
    Array(props.len).fill(1).map((square, i) => <Row className={props.ship} key={i}><Button className={selected} onClick={() => props.onShipClick()}></Button></Row>) :
    Array(props.len).fill(1).map((square, i) => <Button key={i} className={selected} onClick={() => props.onShipClick()}></Button>);
  return (
    <div>{ship}<br /><br /></div>
  );
}

export default Ship;
