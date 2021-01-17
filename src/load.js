import React from 'react';
import { Route } from 'react-router-dom';
import { Container, Row, Button, Toast, ProgressBar } from 'react-bootstrap';
import { DexProfile } from './util.js';

export class LoadDex extends React.Component {
  constructor(props) {
    super(props);
    this.main = React.createRef();
    this.state = {
      showLoad: false,
      loadFile: null,
      progress: -1,
    }
  }

  async uploadFile(history) {
    if (this.state.loadFile) {
      const reader = new FileReader()
      reader.addEventListener('load', (event) => {
        const profile = DexProfile.fromJSON(event.target.result);
        this.props.onLoadedDex(profile);
        this.setState({...this.state, loadFile: null, showLoad: false, progress: -1});
        history.push("/profile");
      });
      reader.addEventListener('progress', (event) => {
        const progress = event.loaded / this.state.loadFile.size * 100;
        this.setState({...this.state, progress: progress});
      });

      reader.readAsText(this.state.loadFile);
    }
  }

  getLoadFile(history) {
    const onCloseToast = () => {
      if (this.state.showLoad) {
        this.setState({...this.state, showLoad: false});
      }
    }
    const verifyButton = () => {
      if (this.state.loadFile && this.state.progress === -1) {
        return (
          <Button className="btn-poke" onClick={() => this.uploadFile(history)}>Accept</Button>
        );
      }
      return null;
    }
    const progressBar = () => {
      if (this.state.progress >= 0) {
        return (
          <ProgressBar variant="success" className="mt-2" animated now={this.state.progress}/>
        );
      }
      return null;
    }
    if (this.state.showLoad) {
      return (
        <Row className="justify-content-md-center mt-4">
          <Toast onClose={onCloseToast}>
            <Toast.Header>
              <strong className="mr-auto">Load Dex</strong>
            </Toast.Header>
            <Toast.Body>
              <input type="file" name=".dex file" accept=".dex" onChange={(event) => this.setState({...this.state, loadFile: event.target.files[0]})}/>
              {verifyButton()}
              {progressBar()}
            </Toast.Body>
          </Toast>
        </Row>
      );
    }
    return null;
  }

  render() {
    return (
      <Route path="/" render={({history}) => (
        <Container className="mt-4">
          {this.getLoadFile(history)}
          <Row className="justify-content-center">
            <h1>PokIndex</h1>
          </Row>
          <Row className="justify-content-center">
            <Button className="btn-poke" onClick={() => this.setState({...this.state, showLoad: true})}>Load .dex file</Button>
          </Row>
          <Row className="justify-content-center">
            <h2>or</h2>
          </Row>
          <Row className="justify-content-center">
            <Button className="btn-poke" onClick={() => {
              this.props.onLoadedDex(new DexProfile());
              history.push("/profile");
            }}>Create new PokIndex</Button>
          </Row>
        </Container>
      )}/>

    );
  }
}
