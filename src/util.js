import React from 'react';

const MONEY_REGEX = /\$(([1-9]\d{0,2}(,\d{3})*)|(([1-9]\d*)?\d))(\.\d\d)/;

export function downloadTextFile(fileName, data) {
  const element = document.createElement("a");
  const file = new Blob([data], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = fileName;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}

export class Popup extends React.Component {

  constructor(props) {
    super(props);
    this.popupRef = React.createRef();
    this.mouseDownEvent = this.mouseDownEvent.bind(this)
  }

  mouseDownEvent(event) {
    if (this.popupRef && !this.popupRef.current.contains(event.target)) {
      this.props.onFinished('exit');
      console.log(event.target);
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.mouseDownEvent)

    this.props.blur.current.style.opacity = 0.3;
    this.docColor = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#c7c5c5';
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.mouseDownEvent)
    this.props.blur.current.style.opacity = 1.0;
    document.body.style.backgroundColor = this.docColor;
  }

  render() {
    return (
      <div ref={this.popupRef} className="popup">
        {this.props.children}
      </div>
    )
  }
}

export class Card {
  constructor(cardName, firstId, secondId) {
    this.cardName = cardName;
    this.firstId = firstId;
    this.secondId = secondId;
    this.lastUpdatedCosts = null;
    this.costEstimate = null;
    this.highValue = null;
    this.lowValue = null;
  }

  toString() {
    return this.cardName + " " + String(this.firstId) + "/" + String(this.secondId);
  }

  getCostData() {
    //TOO: Fix for not using proxy service for the requests possible port to server side data (depending on popularity)
    const corsAnywhere = 'https://cors-anywhere.herokuapp.com/';
    const url = "https://mavin.io/search?q=" + this.cardName + "+" + this.firstId + "%2F" + this.secondId + "&bt=sold";
    // console.log(url);
    const promiseFn = function (resolve, reject) {
      fetch(corsAnywhere + url)
        .then((res) => res.text())
        .then((text) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'text/html');
          const scripts = doc.scripts;
          let i;
          for (i = 0; i < scripts.length; i++) {
            if (scripts[i].type === 'application/ld+json') {
              let obj = JSON.parse(scripts[i].textContent);
              if (Array.isArray(obj)) {
                obj = obj[0];
              }
              if (obj["@type"] === "ProductGroup") {
                const estimate = obj.description.match(MONEY_REGEX)[0];
                this.costEstimate = Number(estimate.substr(1, estimate.length));
                this.lowValue = Number(obj.offers.lowPrice);
                this.highValue = Number(obj.offers.highPrice);
                this.lastUpdatedCosts = new Date();
              }
            }
          }
          resolve(this);
        }).catch(err => {
          console.log(err);
          reject();
        });
    }
    return new Promise(promiseFn.bind(this));
  }
}

export class DexProfile {
  constructor() {
    this.cards = [];
    this.history = [];
  }

  addCard(card) {
    this.cards.push(card);
  }

  getTotalCardEstimate() {
    let total = 0.0;
    let i;
    for(i = 0; i < this.cards.length; i++) {
      total = total + this.cards[i].costEstimate;
    }
    return total;
  }

  getBlob() {
    return JSON.stringify(this);
  }
}
