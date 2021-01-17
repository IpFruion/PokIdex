class DateTimeInterval {
  constructor(obj) {
    this.time = 0;
    let intervalSelector = 1;
    if (obj) {
      if (obj.milliseconds) {
        this.time += obj.milliseconds * intervalSelector;
      }
      intervalSelector *= 1000;
      if (obj.seconds) {
        this.time += obj.seconds * intervalSelector;
      }
      intervalSelector *= 60;
      if (obj.minutes) {
        this.time += obj.minutes * intervalSelector;
      }
      intervalSelector *= 60;
      if (obj.hours) {
        this.time += obj.hours * intervalSelector;
      }
      intervalSelector *= 24;
      if (obj.days) {
        this.time += obj.days * intervalSelector;
      }
    }
  }

  toObj() {
    const obj = {};
    let timeSelector = this.time;
    obj.milliseconds = timeSelector % 1000;
    timeSelector = Math.floor(timeSelector / 1000);
    obj.seconds = timeSelector % 60;
    timeSelector = Math.floor(timeSelector / 60);
    obj.minutes = timeSelector % 60;
    timeSelector = Math.floor(timeSelector / 60);
    obj.hours = timeSelector % 24;
    timeSelector = Math.floor(timeSelector / 24);
    obj.days = timeSelector;
    return obj;
  }

  addToDateObj(date) {
    date.setTime(date.getTime() + this.time);
  }

  addInterval(interval) {
    return new DateTimeInterval({milliseconds: this.time + interval.time});
  }

  toString() {
    let str = "";
    const obj = this.toObj();
    if (obj.days > 0) {
      str += obj.days.toString() + "days ";
    }
    if (obj.hours > 0) {
      str += obj.hours.toString() + "hrs ";
    }
    if (obj.minutes > 0) {
      str += obj.hours.toString() + "mins ";
    }
    if (obj.seconds > 0) {
      str += obj.seconds.toString() + "secs ";
    }
    // if (obj.milliseconds > 0) {
    //   str += obj.milliseconds.toString() + "millisecs";
    // }
    return str;
  }
}

const MONEY_REGEX = /\$(([1-9]\d{0,2}(,\d{3})*)|(([1-9]\d*)?\d))(\.\d\d)/;
const SOLD_RESULTS_REGEX = /^\D*([\d])/;
const CARD_UPDATE_TIMEOUT = new DateTimeInterval({days: 3});
const CORS_ANYWHERE = 'https://cors-anywhere.herokuapp.com/';
const MAVIN_URL = CORS_ANYWHERE + "https://mavin.io/search";
const POKEMON_TCG_URL = 'https://api.pokemontcg.io/v1/cards';

export function downloadTextFile(fileName, data) {
  const element = document.createElement("a");
  const file = new Blob([data], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = fileName;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}

function formatURL(url, params) {
  let formatted = url;
  if (Object.keys(params).length > 0) {
    formatted += "?";
  }
  for (const [key, value] of Object.entries(params)) {
    formatted += key + "=";
    formatted += encodeURI(value) + "&";
  }
  formatted = formatted.substring(0, formatted.length-1);
  return formatted;
}

export class PokeCard {
  constructor(cardName, firstId, secondId) {
    this.cardName = cardName;
    this.firstId = firstId;
    this.secondId = secondId;
    this.lastUpdated = null;
    this.costEstimate = null;
    this.highValue = null;
    this.lowValue = null;
    this.artist = null;
    this.imageUrl = null;
  }

  toString() {
    return this.cardName + " " + String(this.firstId) + "/" + String(this.secondId);
  }

  updatedSinceString() {
    const interval = new DateTimeInterval({milliseconds: (new Date()).getTime() - this.lastUpdated.getTime()});
    let intervalStr = "Last Updated " + interval.toString() + " ago";
    return intervalStr;
  }

  updateData() {
    const promiseFn = function(resolve, reject) {
      Promise.all([this._updateCardData(), this._updateCostData()]).then(values =>{
        this.lastUpdated = new Date();
        resolve(this);
      }).catch(err => reject(err));
    };
    return new Promise(promiseFn.bind(this));
  }

  _updateCardData() {
    const url = formatURL(POKEMON_TCG_URL, {
      name: this.cardName,
      number: Number(this.firstId).toString(),
    });
    return fetch(url)
      .then(res => res.text())
      .then(text => JSON.parse(text))
      .then(obj => {
        if (obj.cards.length > 0) {
          const cardObj = obj.cards[0];
          this.artist = cardObj.artist;
          this.imageUrl = cardObj.imageUrl;
        }
      });
  }

  _updateCostData() {
    // TODO: Fix for not using proxy service for the requests possible port to server side data (depending on popularity)
    const url = formatURL(MAVIN_URL, {
      q: this.cardName + " " + this.firstId + "/" + this.secondId,
      bt: "sold",
    });
    return fetch(url)
      .then(res => res.text())
      .then(text => {
        const parser = new DOMParser();
        return parser.parseFromString(text, 'text/html');
      })
      .then(doc => {
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
            }
            if (obj["@type"] === "Article") {
              const match = obj["articleBody"].match(SOLD_RESULTS_REGEX);
              if (match && Number(match[1]) === 0) {
                throw new Error("Zero Sold Results Found");
              }
            }
          }
        }
      });
  }
  static fromObj(obj) {
    const card = Object.assign(new PokeCard(), obj);
    card.lastUpdated = new Date(card.lastUpdated);
    return card;
  }
}

export class DexProfile {
  constructor() {
    this.cards = [];
    this.history = [];
    this.lastUpdated = new Date();
  }

  _takeSnapshotToHistory() {
    const event = [];
    let i;
    for (i = 0; i < this.cards.length; i++) {
      const copy = Object.assign({}, this.cards[i]);
      event.push(copy);
    }
    this.history.push(Object.assign(new DexProfile(), {cards: event, lastUpdated: this.lastUpdated}));
  }

  addCard(card) {
    if (this.lastUpdated) {
      this._takeSnapshotToHistory();
    }
    this.lastUpdated = card.lastUpdated;
    this.cards.push(card);
  }

  checkIfCardsNeedUpdate() {
    let i;
    const now = new Date();
    for (i = 0; i < this.cards.length; i++) {
      const lastUpdated = this.cards[i].lastUpdated;
      const checkDate = new Date(lastUpdated.getTime());
      CARD_UPDATE_TIMEOUT.addToDateObj(checkDate);
      if (now >= checkDate) {
        return true;
      }
    }
    return false;
  }

  updateCards(force) {
    let i;
    const cardsToUpdate = [];
    const now = new Date();
    for (i = 0; i < this.cards.length; i++) {
      if (force) {
        cardsToUpdate.push(this.cards[i]);
      } else {
        const lastUpdated = this.cards[i].lastUpdated;
        const checkDate = new Date(lastUpdated.getTime());
        CARD_UPDATE_TIMEOUT.addToDateObj(checkDate);
        if (now >= checkDate) {
          cardsToUpdate.push(this.cards[i]);
        }
      }
    }
    if (cardsToUpdate.length > 0) {
      this._takeSnapshotToHistory();
      const updates = [];
      for (i = 0; i < cardsToUpdate.length; i++) {
        updates.push(cardsToUpdate[i].updateData());
      }
      return Promise.all(updates).then((values) => {

        this.lastUpdated = new Date();
      });
    }
    return new Promise((resolve, reject) => reject(new Error("No Cards Updated")));
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

  static fromObj(obj) {
    let profile = new DexProfile();
    profile = Object.assign(profile, obj);
    let i;
    for (i = 0; i < profile.history.length; i++) {
      profile.history[i] = DexProfile.fromObj(profile.history[i]);
    }
    for (i = 0; i < profile.cards.length; i++) {
      profile.cards[i] = PokeCard.fromObj(profile.cards[i]);
    }
    profile.lastUpdated = new Date(profile.lastUpdated);
    return profile;
  }

  static fromJSON(jsonString) {
    const obj = JSON.parse(jsonString);
    return DexProfile.fromObj(obj);
  }
}
