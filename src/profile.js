import React from 'react';
import { Route } from 'react-router-dom';
import './profile.css';
import { downloadTextFile } from './util.js';
import { LineChart } from 'react-chartkick'
import 'chart.js'

export class Profile extends React.Component {

  getChartData() {
    let data = {};
    // let i;
    // for (i = 0; i < this.props.dexProfile.history.length; i++) {
    //   const prevProfile = this.props.dexProfile.history[i];
    //   data[prevProfile.lastUpdatedCosts.toString()] = prevProfile.getTotalCardEstimate();
    // }
    data[(new Date()).toString()] = this.props.dexProfile.getTotalCardEstimate();
    return data;
  }

  // TODO: Add graph for money and then a card list
  render() {
    return (
      <Route exact={true} path="/profile" render={({history}) => (
        <div className="dex-info-container">
          <button onClick={() => history.push("/scanner")}>Scanner</button>
          <button onClick={() => history.push("/newcard")}>Manual Enter Card</button>
          {this.props.dexProfile.cards.length > 0 && (
            <button onClick={() => downloadTextFile("profile.dex", this.props.dexProfile.getBlob())}>Save Dex</button>
          )}
          <h1>Total cards: {this.props.dexProfile.cards.length}</h1>
          <h1>Total price: {this.props.dexProfile.getTotalCardEstimate()}</h1>
          <LineChart data={this.getChartData()}/>
        </div>
      )}/>
    );
  }

}
