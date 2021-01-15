import React from 'react';
import { Route } from 'react-router-dom';
import { Card } from './util.js';
import { Container, Form, Button, Toast } from 'react-bootstrap';
import { Formik } from 'formik';


const _CARD_NUMBER_REGEX = /^([1-9]\d*)[/]([1-9]\d*)$/;

export class NewCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentCard: null,
    }
    this.submitData = this.submitData.bind(this);
  }

  submitData(values, form) {
    const matches = values.cardNumbers.match(_CARD_NUMBER_REGEX);
    const card = new Card(values.cardName, matches[1], matches[2]);
    card.getCostData().then((card) => {
      if (card) {
        this.props.addCardToDex(card);
        this.setState({...this.state, currentCard: card});
        form.resetForm();
      } else {
        throw new Error("Card is Null");
      }
    }).catch(err => {
      form.setFieldError("cardName", "Card Not Found");
      form.setFieldError("cardNumbers", "Card Not Found");
      const error = {};
      error.type = 'danger';
      error.component = (
        <strong>{err.toString()}</strong>
      );
      this.props.onError(error);
    });
  }

  onSubmitCard() {
    // Validate card name and number i.e. make sure card name is one word and all letters
    // Card number is two numbers seperated by a forward slash
    // console.log(form);

    // this.onSubmitCard(event.target);
  }

  validateCard(values, props) {
    const errors = {};
    if (values.cardName) {
      if (values.cardName.match(/[0-9 ]+/)) {
        errors.cardName = "Card Name can't have spaces or numbers";
      }
    } else {
      errors.cardName = "Card Name is required";
    }

    if (values.cardNumbers) {
      const matching = values.cardNumbers.match(_CARD_NUMBER_REGEX);
      if (!matching) {
        errors.cardNumbers = "Card Numbers must be in the form of 'num/num'"
      } else if (Number(matching[1]) > Number(matching[2])) {
        errors.cardNumbers = "Card Numbers must be in order i.e. firstNum <= secondNum"
      }
    } else {
      errors.cardNumbers = "Card Numbers is required";
    }

    return errors;
  }

  getToast() {
    // TODO: Image of pokemon in Toast?
    // <img
    //   src="holder.js/20x20?text=%20"
    //   className="rounded mr-2"
    //   alt=""
    // />
    if (this.state.currentCard) {
      return (
        <Toast
          show={!!this.state.currentCard}
          className='mt-3'
          onClose={() => this.setState({...this.state, currentCard: null})}
          delay={10000}
          autohide
        >
          <Toast.Header>
            <strong className="mr-auto">{this.state.currentCard.cardName}</strong>
            <small>{this.state.currentCard.lastUpdated.toLocaleString()}</small>
          </Toast.Header>
          <Toast.Body>
            Loaded {this.state.currentCard.cardName} - {this.state.currentCard.firstId + "/" + this.state.currentCard.secondId} into DexProfile!
          </Toast.Body>
        </Toast>
      );
    }
    return null;
  }

  render() {
    return (
      <Route exact={true} path="/newcard" render={({history}) => (
        <Container className="mt-4">
          <Formik
            onSubmit={this.submitData}
            initialValues={{
              cardName: '',
              cardNumbers: '',
            }}
            validate={this.validateCard}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="cardNameValidation">
                  <Form.Label>Card Name</Form.Label>
                  <Form.Control
                    name="cardName"
                    onChange={handleChange}
                    value={values.cardName}
                    isValid={touched.cardName && !errors.cardName}
                    isInvalid={touched.cardName && !!errors.cardName}
                    type="text"
                    placeholder="Enter Card Name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cardName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="cardNumbersValidation">
                  <Form.Label>Card Numbers</Form.Label>
                  <Form.Control
                    name="cardNumbers"
                    onChange={handleChange}
                    value={values.cardNumbers}
                    type="text"
                    placeholder="Enter Card First/Second Numbers"
                    isValid={touched.cardNumbers && !errors.cardNumbers}
                    isInvalid={touched.cardNumbers && !!errors.cardNumbers}
                  />
                  <Form.Text className="text-muted">
                    i.e. "141/189"
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.cardNumbers}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button className="rounded-pill px-4 m-2" type="submit">Submit Card</Button>
                <Button className="rounded-pill px-4 m-2" onClick={() => history.push("/profile")}>Profile</Button>
              </Form>
              )
            }
          </Formik>
          {this.getToast()}
        </Container>
      )}/>
    );
  }
}
