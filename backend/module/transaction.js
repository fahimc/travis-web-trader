class Transaction {
    constructor(prediction, model) {
        this.purchasePrice = null;
        this.prediction = prediction;
        this.tickCount = 0;
        this.isWin = false;
        this.second = false;
        this.ended = false;
        this.ended = false;
        this.tickArray = [];

    }
    run(price, model) {
        price = Number(price);
        if (!this.purchasePrice) {
            this.purchasePrice = price;
        } else {
            this.tickArray.push(price);

        }
        if (this.ended) return;
        this.tickCount++;
        if (!this.second) this.checkSecond(price, model);
        if (this.tickCount >= 6) {

            this.isWin = (this.purchasePrice < price && this.prediction.prediction == 'CALL' || this.purchasePrice > price && this.prediction.prediction == 'PUT');
            this.ended = true;
        }
    }
    removeDecimal(price) {
        let arr = String(price).split('.');
        if (!arr[1]) return price;
        let count = arr[1].length;
        let per = Math.pow(10, count + 1);
        return price * per;
    }
    checkSecond(price, model) {
        if (!this.purchasePrice) this.purchasePrice = price;
        let change = this.purchasePrice - price;
        let changeBarrier = 1.7;
        if (this.prediction.prediction == 'CALL' && price < this.purchasePrice && change >= changeBarrier || this.prediction.prediction == 'PUT' && price > this.purchasePrice && change >= changeBarrier) {
            this.prediction = { prediction: price < this.purchasePrice ? 'PUT' : 'CALL', type: 'DIRECTION_SECOND' };
            this.second = true;
            model.createTransaction(this.prediction);
        }
    }
};

module.exports = Transaction;
