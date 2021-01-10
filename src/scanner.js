/* global cv */
import React from 'react';
import { Route } from 'react-router-dom';
import { Camera, FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
// import ReactDOM from 'react-dom';

function imageDataUriToMat(uri) {
  return new Promise(function(resolve, reject) {
    if (uri == null) {
      return reject();
    }
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let image = new Image();
    image.addEventListener('load', function() {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(cv.imread(canvas));
    })
    image.src = uri;
    // const base64data = uri.replace('data:image/jpeg;base64','').replace('data:image/png;base64','');
    // const buffer = Buffer.from(base64data,'base64');
    // return cv.imdecode(buffer);
  });
}

export class Scanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
    }
  }

  takePhoto(dataUri) {
    imageDataUriToMat(dataUri).then(function (mat) {
      console.log(mat);
    });
  }

  render() {
    return (
      <Route exact={true} path="/scanner" render={({history}) => (
        <div className="scanner">
          <button onClick={() => history.push("/profile")}>Profile</button>
          <Camera
            idealFacingMode={FACING_MODES.ENVIRONMENT}
            idealResolution = {{width: 640, height: 480}}
            imageCompression = {0.97}
            isMaxResolution = {false}
            isImageMirror = {false}
            isSilentMode = {true}
            isDisplayStartCameraError = {true}
            isFullscreen = {false}
            sizeFactor = {1}
            onTakePhoto = {this.takePhoto}
          />
          {this.state.image}
        </div>
      )}/>
    )
  }
}
