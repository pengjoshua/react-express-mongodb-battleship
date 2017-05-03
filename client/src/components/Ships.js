import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Carrier from './Carrier';
import Battleship from './Battleship';
import Cruiser from './Cruiser';
import Submarine from './Submarine';
import Destroyer from './Destroyer';

function Ships(props) {
  let carrier, battleship, cruiser, submarine, destroyer;
  carrier = (props.shipPlaced.carrier) ? '' : <Carrier vertical={props.vertical} selected={props.shipSelected.carrier} onCarrierClick={() => props.onCarrierClick()} />;
  battleship = (props.shipPlaced.battleship) ? '' : <Battleship vertical={props.vertical} selected={props.shipSelected.battleship} onBattleshipClick={() => props.onBattleshipClick()} />;
  cruiser = (props.shipPlaced.cruiser) ? '' : <Cruiser vertical={props.vertical} selected={props.shipSelected.cruiser} onCruiserClick={() => props.onCruiserClick()} />;
  submarine = (props.shipPlaced.submarine) ? '' : <Submarine vertical={props.vertical} selected={props.shipSelected.submarine} onSubmarineClick={() => props.onSubmarineClick()} />;
  destroyer = (props.shipPlaced.destroyer) ? '' : <Destroyer vertical={props.vertical} selected={props.shipSelected.destroyer} onDestroyerClick={() => props.onDestroyerClick()} />;
  return (
    <Grid>
      <Row>
        <Col>{carrier}</Col>
        <Col>{battleship}</Col>
        <Col>{cruiser}</Col>
        <Col>{submarine}</Col>
        <Col>{destroyer}</Col>
      </Row>
    </Grid>
  );
}

export default Ships;
