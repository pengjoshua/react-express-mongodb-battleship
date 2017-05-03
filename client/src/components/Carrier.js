import React from 'react';
import { Button, Row } from 'react-bootstrap';

function Carrier(props) {
  let selected = (props.selected) ? 'selected' : 'normal';
  let ship = (props.vertical) ?
    Array(5).fill(1).map((square, i) => <Row className="carrier" key={i}><Button className={selected} onClick={() => props.onCarrierClick()}></Button></Row>) :
    Array(5).fill(1).map((square, i) => <Button key={i} className={selected} onClick={() => props.onCarrierClick()}></Button>);
  return (
    <div>{ship}<br /><br /></div>
  );
}

export default Carrier;
