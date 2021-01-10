import React from 'react';
import ReactDOM from 'react-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useState } from 'react';
// import { Container, Row, Alert, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Scanner } from './scanner.js';
import { Profile } from './profile.js';
import { Popup, DexProfile } from './util.js';
import { NewCard } from './newcard.js';
import './index.css';

function LoadFile(props) {
  const [verify, setVerify] = React.useState(null);
  const [file, setFile] = React.useState(null);
  function loadedFile(event) {
    setFile(event.target.files[0]);
    setVerify((<button onClick={() => props.onFinished(file)}>Accept</button>));
  }
  const lf = (
    <div className="loadfile">
      <h1>Input Dex File</h1>
      <input type="file" name=".dex file" accept=".dex" onChange={loadedFile}/>
      {verify}
    </div>
  );
  return <Popup blur={props.blur} children={lf} onFinished={() => props.onFinished(null)}/>
}

class LoadDex extends React.Component {
  constructor(props) {
    super(props);
    this.main = React.createRef();
    this.state = {
      loadFileMenu: null,
    }
  }

  async uploadFile(file) {
    const reader = new FileReader()
    reader.onLoad = function (event) {
      this.props.onLoadedDex(JSON.parse(event.target.result));
    }
    reader.readAsText(file);
  }

  showLoadFile(isLoad) {
    let loadFileMenu = null;
    if (isLoad) {
      loadFileMenu = <LoadFile blur={this.main} onFinished={(file) => {
        if (file) {
          //TODO: Loading screen? or progress bar?
          this.uploadFile(file);
        }
        this.showLoadFile(false);
      }}/>;
    }
    this.setState({...this.state, loadFileMenu: loadFileMenu});
  }

  render() {
    return (
      <Route path="/" render={({history}) => (
        <div className="container">
          {this.state.loadFileMenu}
          <div ref={this.main} className="main">
            <h1>PokIndex</h1>
            <button onClick={() => this.showLoadFile(true)}>Load .dex file</button>
            <h2>or</h2>
            <button onClick={() => {
              this.props.onLoadedDex(new DexProfile());
              history.push("/profile");
            }}>Create new PokIndex</button>
          </div>
        </div>
      )}/>

    );
  }
}

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
    }
    this.addCardToDex = this.addCardToDex.bind(this);
  }

  addCardToDex(card) {
    if (this.state.dexProfile && card) {
      this.state.dexProfile.addCard(card);
    }
  }

  // TODO: Instead of popout being inside loaded supply here so that all pages have access
  render () {
    // <Route render={() => (
    //   <NotFound dexProfile={this.state.dexProfile}/>
    // )}/>
    //TODO: Figure out how to when this.state.dexProfile is null go back to / home
    return (
      <Router>
        <Switch>
          {!this.state.dexProfile &&
            <LoadDex onLoadedDex={(dexProfile) => this.setState({...this.state, dexProfile: dexProfile})}/>
          }
          {this.state.dexProfile && (
            <div>
              <Scanner addCardToDex={this.addCardToDex}/>
              <NewCard addCardToDex={this.addCardToDex}/>
              <Profile dexProfile={this.state.dexProfile}/>
            </div>
          )}
        </Switch>
      </Router>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
