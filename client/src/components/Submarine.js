import React from 'react';
import { Button, Row } from 'react-bootstrap';

function Submarine(props) {
  let selected = (props.selected) ? 'selected' : 'normal';
  let ship = (props.vertical) ?
    Array(2).fill(1).map((square, i) => <Row className="submarine" key={i}><Button className={selected} onClick={() => props.onSubmarineClick()}></Button></Row>) :
    Array(2).fill(1).map((square, i) => <Button key={i} className={selected} onClick={() => props.onSubmarineClick()}></Button>);
  return (
    <div>{ship}<br /><br /></div>
  );
}

export default Submarine;
