class Transaction {
    constructor(prediction, model) {
        this.purchasePrice = null;
        this.prediction = prediction;
        this.tickCount = 0;
        this.isWin = false;
        this.ended = false;
    }
    run(price) {
        if (this.ended) return;
        if (!this.purchasePrice) this.purchasePrice = price;
        this.tickCount++;
        if (this.tickCount >= 6) {
            this.isWin = (this.purchasePrice < price && this.prediction.prediction == 'CALL' || this.purchasePrice > price && this.prediction.prediction == 'PUT');
            this.ended = true;
        }
    }
};

module.exports = Transaction;
