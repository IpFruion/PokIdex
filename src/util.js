
function roundNumber(num, scale) {
  return +(Math.round(num + "e+" + scale) + "e-" + scale);
}

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

export class ValidationError extends Error {
  constructor(msg, fieldName) {
    super(msg);
    this.fieldName = fieldName;
  }
}

const MONEY_REGEX = /\$(([1-9]\d{0,2}(,\d{3})*)|(([1-9]\d*)?\d))(\.\d\d)/;
const SOLD_RESULTS_REGEX = /^\D*([\d])/;
const CARD_UPDATE_TIMEOUT = new DateTimeInterval({days: 3});
const CORS_ANYWHERE = 'https://cors-anywhere.herokuapp.com/';
const MAVIN_URL = CORS_ANYWHERE + "https://mavin.io/search";
const POKEMON_TCG_URL = 'https://api.pokemontcg.io/v1/cards';

const CARD_NAME_REGEX = /^[a-zA-Z ]*$/;
const CARD_NUMBER_SLASH_NUMBER_REGEX = /^(\d{1,3})[/](\d{1,3})$/;
const CARD_NUMBER_REGEX = /^(\d{1,3})$/
const CARD_PACK_NUMBER_REGEX = /^[A-Z]*(\d{1,3})$/;

export const POKE_CARD_VALIDATOR = {
  cardName: cardName => {
    if (!cardName) {
      return new Error("Card Name is required");
    }
    const cardNameMatch = cardName.match(CARD_NAME_REGEX);
    if (!cardNameMatch) {
      return new Error("Card Name can't have numbers or other characters");
    }
  },
  id: id => {
    try {
      PokeCard._parseId(id);
    } catch (e) {
      return e;
    }
    return null;
  },
  quantity: quantity => {
    if (!quantity) {
      return new Error("Quantity is required");
    }
    if (!quantity.match(/^\d*$/)) {
      return new Error("Quantity must be a number");
    }
    const n = Number(quantity);
    if (!Number.isInteger(n)) {
      return new Error("Quantity must be an integer number");
    }
    if (n < 1) {
      return new Error("Quantity must be greater than or equal to 1");
    }
  }

}

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
  constructor(cardName, id, number, secondNumber, quantity) {
    this.cardName = cardName;
    this.id = id;
    this.number = number;
    this.quantity = quantity;
    this.secondNumber = secondNumber;

    //Values gained from websites
    this.lastUpdated = null;
    this.costEstimate = null;
    this.highValue = null;
    this.lowValue = null;
    this.artist = null;
    this.imageUrl = null;
  }

  toString() {
    return this.cardName + " " + String(this.id);
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
      number: Number(this.number).toString(),
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
      q: this.cardName + " " + this.id,
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
    // Verify card?
    // card.verifyCard();
    card.lastUpdated = new Date(card.lastUpdated);
    return card;
  }

  static _parseId(id) {
    if (!id) {
      throw new Error("Card Numbers is required");
    }
    const cardSlashMatch = id.match(CARD_NUMBER_SLASH_NUMBER_REGEX);
    const cardNumberMatch = id.match(CARD_NUMBER_REGEX);
    const cardPackMatch = id.match(CARD_PACK_NUMBER_REGEX);
    let number = null;
    let secondNumber = null;
    if (cardSlashMatch) {
      if (Number(cardSlashMatch[1]) > Number(cardSlashMatch[2])) {
        throw new Error("Card Numbers must be in order i.e. firstNum <= secondNum");
      }
      number = cardSlashMatch[1];
      secondNumber = cardSlashMatch[2];
    } else if (cardNumberMatch) {
      number = cardNumberMatch[1];
    } else if (cardPackMatch) {
      number = cardPackMatch[1];
    } else {
      throw new Error("Card Numbers must be in the form of 'num/num' or 'num' or '<packname><num>'");
    }
    return [number, secondNumber];
  }

  static parseEntries(cardName, id, quantity) {
    const cardNameError = POKE_CARD_VALIDATOR["cardName"](cardName);
    if (cardNameError) {
      throw cardNameError;
    }
    const [number, secondNumber] = PokeCard._parseId(id);
    const quantityError = POKE_CARD_VALIDATOR["quantity"](quantity);
    if (quantityError) {
      throw quantityError;
    }

    return new PokeCard(cardName, id, number, secondNumber, quantity)
  }


}

export class DexProfile {
  constructor() {
    this.cards = [];
    this.history = [];
    this.lastUpdated = new Date();
  }

  _takeSnapshotToHistory() {
    const snapshot = {
      lastUpdated: this.lastUpdated,
      totalCardsCost: this.getTotalCardEstimate(),
    };
    this.history.push(snapshot);
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
    return roundNumber(total, 2);
  }

  getBlob() {
    return JSON.stringify(this);
  }

  static fromObj(obj) {
    let profile = new DexProfile();
    profile = Object.assign(profile, obj);
    let i;
    // for (i = 0; i < profile.history.length; i++) {
    //   profile.history[i] = {
    //     lastUpdated: profile.history[i].lastUpdated,
    //     totalCardsCost: profile.history[i].totalCardsCost,
    //   };
    // }
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
