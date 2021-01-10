import React from 'react';
import { Route } from 'react-router-dom';
import { Card } from './util.js';

export class NewCard extends React.Component {

  constructor(props) {
    super(props);
    this.cardNameInput = React.createRef();
    this.cardNumbersInput = React.createRef();
  }

  submitData(history) {
    const cardName = this.cardNameInput.current.value;
    const values = this.cardNumbersInput.current.value.split("/");
    const firstValue = values[0];
    const secondValue = values[1];
    const card = new Card(cardName, firstValue, secondValue);
    // TODO: Add Progress Bar Circular
    card.getCostData().then((card) => {
      if (card) {
        this.props.addCardToDex(card);
        history.push("/profile");
      } else {
        console.log("Card is Null Error");
      }
    });
  }

  render() {
    return (
      <Route exact={true} path="/newcard" render={({history}) => (
        <div>
          <h2>Card Name:</h2>
          <input ref={this.cardNameInput} name="cardname"/>
          <h2>Card Numbers:</h2>
          <input ref={this.cardNumbersInput} name="cardnumbers"/><br></br>
          <button onClick={() => history.push("/profile")}>Profile</button>
          <button onClick={() => this.submitData(history)}>Accept</button>
        </div>
      )}/>
    );
  }
}
