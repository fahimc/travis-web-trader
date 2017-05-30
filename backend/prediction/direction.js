const Prediction = {
  prediction: null,
  second: false,
  purchasePrice: 0,
  tickCount: 0,
  predict(price, history, model) {
    if (model.transactionCollection.length >= 1) {
      return;
    }
    //let marketIsGood = this.checkHistory(history,model);
    if (model.transactionCollection.length == 1 && !this.second) {
      if (!this.purchasePrice) this.purchasePrice = price;
      if (this.prediction.prediction == 'CALL' && price < this.purchasePrice || this.prediction.prediction == 'PUT' && price > this.purchasePrice) this.tickCount++;
      if (this.tickCount >= 1) {
        this.prediction = { prediction: price < this.purchasePrice ?  'PUT' : 'CALL', type: 'DIRECTION_SECOND' };
        this.second=true;
        return this.prediction;
      }
    } else {
      return this.check(history, model);
    }

  },
  check(history, model) {
    let collection = history.slice(history.length - 10, history.length);
    let previous = collection[0];
    let ups = 0;
    let downs = 0;
    collection.forEach((price) => {
      if (price > previous) ups++;
      if (price < previous) downs++;
      previous = price;
    });

    let total = ups + downs;
    let limit = 0.7;
    if (model.lossStreak > 3) limit = 0.9;

    let upPercentage = (ups / total);
    let downPercentage = (downs / total);
    let prediction = upPercentage > limit ? 'CALL' : (downPercentage > limit ? 'PUT' : '');
    if (prediction) {
      let collection = history.slice(history.length - 2, history.length);
      this.prediction = { prediction: prediction, type: 'DIRECTION_' + prediction };
      return this.prediction;
    }
  },
  checkHistory(history, model) {
    let collection = history.slice(history.length - 60, history.length);
    let prediction = null;
    let count = 0;
    let wins = 0;
    let loses = 0;
    collection.forEach((price, index) => {
      if (prediction) {
        if (!count) prediction.purchasePrice = price;
        count++;
        if (count >= 6) {
          if (prediction.prediction == 'CALL' && price > prediction.purchasePrice || prediction.prediction == 'PUT' && price < prediction.purchasePrice) {
            wins++;
          } else {
            loses++;
          }
          prediction = null;
          count = 0;
        }
      } else {
        let ticks = history.slice(0, index + 1);
        prediction = this.check(ticks, model);
      }
    });
    return wins / (wins + loses) > 0.52;
  }
};

module.exports = Prediction;
