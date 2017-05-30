class Transaction {
  constructor(prediction, model) {
    this.purchasePrice = null;
    this.prediction = prediction;
    this.tickCount = 0;
    this.isWin = false;
    this.second = false;
    this.ended = false;
    this.cost = 0;
  }
  run(price, model) {
    if (this.ended) return;
    if (!this.purchasePrice) {
      this.purchasePrice = price;
    }
    this.tickCount++;
    if (!this.second) this.checkSecond(price, model);
    if (this.tickCount >= 6) {
      this.isWin = (this.purchasePrice < price && this.prediction.prediction == 'CALL' || this.purchasePrice > price && this.prediction.prediction == 'PUT');
      this.ended = true;
    }
  }
  checkSecond(price, model) {
    if (!this.purchasePrice) this.purchasePrice = price;
    if (this.prediction.prediction == 'CALL' && price < this.purchasePrice || this.prediction.prediction == 'PUT' && price > this.purchasePrice) {
      this.prediction = { prediction: price < this.purchasePrice ? 'PUT' : 'CALL', type: 'DIRECTION_SECOND' };
      this.second = true;
      model.createTransaction(this.prediction);
    }
  }
};

module.exports = Transaction;
