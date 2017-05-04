import React from 'react';
import { Button } from 'react-bootstrap';

function Square(props) {
  let color = 'square';
  if (props.value === 77) color = 'miss';
  else if (props.value > 0 && props.value < 11 && !props.allShipsPlaced) color = 'ship';
  else if (props.value > 0 && props.value < 11 && props.allShipsPlaced) color = 'hiddenship';
  else if (props.value > 10 && props.value < 21) color = 'hit';
  else if (props.value === 88) color = 'sunk';
  else if (props.value === 99) color = 'won';
  return (
    <Button className={color} id={'square' + props.id} onClick={() => props.onClick()}>
      {/* props.value */}
    </Button>
  );
}

export default Square;
