import React from 'react';
import { Button, Row } from 'react-bootstrap';

function Cruiser(props) {
  let selected = (props.selected) ? 'selected' : 'normal';
  let ship = (props.vertical) ?
    Array(3).fill(1).map((square, i) => <Row className="cruiser" key={i}><Button className={selected} onClick={() => props.onCruiserClick()}></Button></Row>) :
    Array(3).fill(1).map((square, i) => <Button key={i} className={selected} onClick={() => props.onCruiserClick()}></Button>);
  return (
    <div>{ship}<br /><br /></div>
  );
}

export default Cruiser;
