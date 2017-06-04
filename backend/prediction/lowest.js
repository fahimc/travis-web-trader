const Prediction = {
  prediction: null,
  predict(price, history, model) {
    if (model.transactionCollection.length >= 1) {
      return;
    }
        this.prediction = { prediction:  'CALL', type: 'LOWEST_PRICE' };
        return this.prediction;
  }
};

module.exports = Prediction;
