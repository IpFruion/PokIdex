import React from 'react';
import { Route } from 'react-router-dom';
import { downloadTextFile } from './util.js';
import { LineChart } from 'react-chartkick'
import { Container, Row, Button } from 'react-bootstrap';
import 'chart.js'

export class Profile extends React.Component {

  getChartData() {
    let data = {};
    // let i;
    // for (i = 0; i < this.props.dexProfile.history.length; i++) {
    //   const prevProfile = this.props.dexProfile.history[i];
    //   data[prevProfile.lastUpdatedCosts.toString()] = prevProfile.getTotalCardEstimate();
    // }
    // data[(new Date()).toString()] = this.props.dexProfile.getTotalCardEstimate();
    return data;
  }

  render() {
    return (
      <Route exact={true} path="/profile" render={({history}) => (
        <Container className="mt-4">
          <Row>
            <Button className="rounded-pill px-4 m-2" onClick={() => history.push("/scanner")}>Scanner</Button>
            <Button className="rounded-pill px-4 m-2" onClick={() => history.push("/newcard")}>Manual Enter Card</Button>
            {this.props.dexProfile.cards.length > 0 && (
              <Button className="rounded-pill px-4 m-2" onClick={() => downloadTextFile("profile.dex", this.props.dexProfile.getBlob())}>Save Dex</Button>
            )}
          </Row>
          <Row>
            <h2>Total cards: {this.props.dexProfile.cards.length}</h2>
          </Row>
          <Row>
            <h2>Total price: {this.props.dexProfile.getTotalCardEstimate()}</h2>
          </Row>
          <Row>
            <LineChart data={this.getChartData()}/>
          </Row>
        </Container>
      )}/>
    );
  }

}
