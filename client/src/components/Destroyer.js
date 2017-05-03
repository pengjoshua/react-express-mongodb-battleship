import React from 'react';
import { Button, Row } from 'react-bootstrap';

function Destroyer(props) {
  let selected = (props.selected) ? 'selected' : 'normal';
  let ship = (props.vertical) ?
    Array(2).fill(1).map((square, i) => <Row className="destroyer" key={i}><Button className={selected} onClick={() => props.onDestroyerClick()}></Button></Row>) :
    Array(2).fill(1).map((square, i) => <Button key={i} className={selected} onClick={() => props.onDestroyerClick()}></Button>);
  return (
    <div>{ship}<br /><br /></div>
  );
}

export default Destroyer;
