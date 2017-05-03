import React from 'react';
import { Button } from 'react-bootstrap';

function Square(props) {
  let color = 'square';
  if (props.value === 7) color = 'miss';
  else if (props.value > 0 && props.value < 6 && !props.allShipsPlaced) color = 'ship';
  else if (props.value > 0 && props.value < 6 && props.allShipsPlaced) color = 'hiddenship';
  else if (props.value === 8) color = 'hit';
  else if (props.value === 9) color = 'sunk';
  else if (props.value === 10) color = 'won';
  return (
    <Button className={color} onClick={() => props.onClick()}>
      {/*props.value*/}
    </Button>
  );
}

export default Square;
