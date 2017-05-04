import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Ship from './Ship';

function Ships(props) {
  let carrier, battleship, cruiser, submarine, destroyer;
  carrier = (props.shipPlaced.carrier) ? '' : <Ship ship={'carrier'} len={props.carrierlen} vertical={props.vertical} selected={props.shipSelected.carrier} onShipClick={() => props.onCarrierClick()} />;
  battleship = (props.shipPlaced.battleship) ? '' : <Ship ship={'battleship'} len={props.battleshiplen} vertical={props.vertical} selected={props.shipSelected.battleship} onShipClick={() => props.onBattleshipClick()} />;
  cruiser = (props.shipPlaced.cruiser) ? '' : <Ship ship={'cruiser'} len={props.cruiserlen} vertical={props.vertical} selected={props.shipSelected.cruiser} onShipClick={() => props.onCruiserClick()} />;
  submarine = (props.shipPlaced.submarine) ? '' : <Ship ship={'submarine'} len={props.submarinelen} vertical={props.vertical} selected={props.shipSelected.submarine} onShipClick={() => props.onSubmarineClick()} />;
  destroyer = (props.shipPlaced.destroyer) ? '' : <Ship ship={'destroyer'} len={props.destroyerlen} vertical={props.vertical} selected={props.shipSelected.destroyer} onShipClick={() => props.onDestroyerClick()} />;
  return (props.vertical) ?
  (
    <Grid>
      <Row>
        <Col xs={1} md={1} lg={1}>{carrier}</Col>
        <Col xs={1} md={1} lg={1}>{battleship}</Col>
        <Col xs={1} md={1} lg={1}>{cruiser}</Col>
        <Col xs={1} md={1} lg={1}>{submarine}</Col>
        <Col xs={1} md={1} lg={1}>{destroyer}</Col>
      </Row>
    </Grid>
  ) :
  (
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
