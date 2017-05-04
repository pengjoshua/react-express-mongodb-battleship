import React from 'react';
import { Button } from 'react-bootstrap';

function Square(props) {
  let color = 'square';
  if (props.value === 11) color = 'miss';
  else if (props.value > 0 && props.value < 11 && !props.allShipsPlaced) color = 'ship';
  else if (props.value > 0 && props.value < 11 && props.allShipsPlaced) color = 'hiddenship';
  else if (props.value === 12) color = 'hit';
  else if (props.value === 13) color = 'sunk';
  else if (props.value === 14) color = 'won';
  return (
    <Button className={color} onClick={() => props.onClick()}>
      {props.value}
    </Button>
  );
}

export default Square;
