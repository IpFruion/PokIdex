import React from 'react';
import ReactDOM from 'react-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
import { Scanner } from './scanner.js';
import { Profile } from './profile.js';
import { NewCard } from './newcard.js';
import { LoadDex } from './load.js';
import './index.scss';

// function NotFound(props) {
//   let loc = "/";
//   if (props.dexProfile) {
//     loc = "/profile";
//   }
//   return (
//     <div>
//       <h1>404 - Not Found!</h1>
//       <Link to={loc}>
//         Go Home
//       </Link>
//     </div>
//   )
// }

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dexProfile: null,
      error: null
    }
    this.addCardToDex = this.addCardToDex.bind(this);
  }

  addCardToDex(card) {
    //TODO: Check if card already in profile? increment
    if (this.state.dexProfile && card) {
      this.state.dexProfile.addCard(card);
    }
  }

  getErrorStatus() {
    if (this.state.error) {
      setTimeout(() => this.setState({...this.state, error: null}), 10000);
      return (
        <Alert show={true} variant={this.state.error.type}>{this.state.error.component}</Alert>
      );
    }
    return null;
  }

  render () {
    // <Route render={() => (
    //   <NotFound dexProfile={this.state.dexProfile}/>
    // )}/>
    const errorFunc = (error) => {
      this.setState({...this.state, error: error})
    };
    return (
      <Router>
        <Switch>
          <div>
            {this.getErrorStatus()}
            {!this.state.dexProfile &&
              <LoadDex onError={errorFunc} onLoadedDex={(dexProfile) => this.setState({...this.state, dexProfile: dexProfile})}/>
            }
            {this.state.dexProfile && (
              <div>
                <Scanner onError={errorFunc} addCardToDex={this.addCardToDex}/>
                <NewCard onError={errorFunc} addCardToDex={this.addCardToDex}/>
                <Profile onError={errorFunc} dexProfile={this.state.dexProfile}/>
              </div>
            )}
          </div>
        </Switch>
      </Router>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
