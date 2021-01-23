import React from 'react';
import { Route } from 'react-router-dom';
import { downloadTextFile } from './util.js';
import { LineChart } from 'react-chartkick'
import { Container, Row, Button, Card, CardColumns } from 'react-bootstrap';
import 'chart.js'

export class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      forceUpdateButton: true,
    }
  }

  getChartData() {
    let data = {};
    let i;
    for (i = 0; i < this.props.dexProfile.history.length; i++) {
      const prevProfile = this.props.dexProfile.history[i];
      data[prevProfile.lastUpdated.toString()] = prevProfile.totalCardsCost;
    }
    data[this.props.dexProfile.lastUpdated.toString()] = this.props.dexProfile.getTotalCardEstimate();
    return data;
  }

  getCardView(card) {
    return (
      <Card style={{ width: '18rem', margin: "10px" }}>
        <Card.Img style={{ height: '200px', width: '100%' }} src={card.imageUrl} />
        <Card.Body>
          <Card.Title>{card.cardName}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{card.id}</Card.Subtitle>
          <Card.Text>
            Cost Estimate: ${card.costEstimate}
          </Card.Text>
          <Button variant="primary">Refresh Card?</Button>
        </Card.Body>
        <Card.Footer>
          <small>{card.updatedSinceString()}</small>
        </Card.Footer>
      </Card>
    );
  }

  getPokeCards() {
    const cards = [];
    let i;
    for (i = 0; i < this.props.dexProfile.cards.length; i++) {
      const card = this.props.dexProfile.cards[i];
      cards.push(this.getCardView(card));
    }
    return (
      <CardColumns className="m-4">
        {cards}
      </CardColumns>
    );
  }

  render() {
    return (
      <Route exact={true} path="/profile" render={({history}) => (
        <Container fluid className="mt-4">
          <Row>
            <Button className="btn-poke" onClick={() => history.push("/scanner")}>Scanner</Button>
            <Button className="btn-poke" onClick={() => history.push("/newcard")}>Manual Enter Card</Button>
            {this.props.dexProfile.cards.length > 0 && (
              <Button className="btn-poke" onClick={() => downloadTextFile("profile.dex", this.props.dexProfile.getBlob())}>Save Dex</Button>
            )}
            {this.props.dexProfile.checkIfCardsNeedUpdate() && (
              <Button className="btn-poke" onClick={() => this.props.dexProfile.updateCards(false)}>Update Cards</Button>
            )}
            {this.state.forceUpdateButton && this.props.dexProfile.cards.length > 0 &&
              <Button className="btn-poke-danger" onClick={() => {
                this.props.dexProfile.updateCards(true).then(() =>{
                  this.setState({...this.state, forceUpdateButton: false});
                }).catch(err => {
                  const error = {};
                  error.type = "warning";
                  error.component = (
                    <h2>{err.toString()}</h2>
                  );
                  this.props.onError(error);
                });
              }}>Force Update</Button>
            }
          </Row>
          <Row className="ml-2">
            <h2>Total cards: {this.props.dexProfile.cards.length}</h2>
          </Row>
          <Row className="ml-2">
            <h2>Total price: ${this.props.dexProfile.getTotalCardEstimate()}</h2>
          </Row>
          <Row>
            <LineChart prefix='$' xtitle="Time" ytitle="Money" data={this.getChartData()}/>
          </Row>
          <Row>
            {this.getPokeCards()}
          </Row>
        </Container>
      )}/>
    );
  }

}
