import React from 'react';
import { Route } from 'react-router-dom';
import { PokeCard, POKE_CARD_VALIDATOR } from './util.js';
import { Container, Form, Button, Toast } from 'react-bootstrap';
import { Formik } from 'formik';

export class NewCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentCard: null,
    }
    this.submitData = this.submitData.bind(this);
  }

  submitData(values, form) {
    const card = PokeCard.parseEntries(values.cardName, values.id, values.quantity);
    card.updateData().then(card => {
      this.props.addCardToDex(card);
      this.setState({...this.state, currentCard: card});
      form.resetForm();
    }).catch(err => {
      const msg = "Card Data Error";
      form.setFieldError("cardName", msg);
      form.setFieldError("cardNumbers", msg);
      console.log(err);
      const error = {};
      error.type = 'danger';
      error.component = (
        <strong>{err.toString()}</strong>
      );
      this.props.onError(error);
    });
  }

  validateCard(values, props) {
    const errors = {};
    for (const [key, value] of Object.entries(values)) {
      if (POKE_CARD_VALIDATOR[key]) {
        const error = POKE_CARD_VALIDATOR[key](value);
        if (error) {
          errors[key] = error.message;
        }
      }
    }
    return errors;
  }

  getToast() {
    // TODO: Image of pokemon in Toast? And Spinner for timings

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
            <img
              style={{ height: '40px', width: '20px', marginRight: '5dp' }}
              src={this.state.currentCard.imageUrl}
              alt=""
            />
            <strong className="mr-auto">{this.state.currentCard.cardName}</strong>
            <small>{this.state.currentCard.lastUpdated.toLocaleString()}</small>
          </Toast.Header>
          <Toast.Body>
            Loaded {this.state.currentCard.cardName} - {this.state.currentCard.id} cost value of ${this.state.currentCard.costEstimate}!
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
              id: '',
              quantity: 1,
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
                <Form.Group>
                  <Form.Label>Card Name</Form.Label>
                  <Form.Control
                    name="cardName"
                    onChange={handleChange}
                    value={values.cardName}
                    isValid={values.cardName && !errors.cardName}
                    isInvalid={(values.cardName || touched.cardName) && !!errors.cardName}
                    type="text"
                    placeholder="Enter Card Name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cardName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Card ID Numbers</Form.Label>
                  <Form.Control
                    name="id"
                    onChange={handleChange}
                    value={values.id}
                    type="text"
                    placeholder="Enter Card Id"
                    isValid={values.id && !errors.id}
                    isInvalid={(values.id || touched.id) && !!errors.id}
                  />
                  <Form.Text className="text-muted">
                    i.e. "141/189" or "058" or "SWSH063"
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.id}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    name="quantity"
                    onChange={handleChange}
                    value={values.quantity}
                    isValid={values.quantity && !errors.quantity}
                    isInvalid={(values.quantity || touched.quantity) && !!errors.quantity}
                    type="text"
                    placeholder="Quantity"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.quantity}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button className="btn-poke" type="submit">Submit Card</Button>
                <Button className="btn-poke" onClick={() => history.push("/profile")}>Profile</Button>
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
