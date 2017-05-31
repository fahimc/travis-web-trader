class Transaction {
    constructor(prediction, model) {
        this.purchasePrice = null;
        this.prediction = prediction;
        this.tickCount = 0;
        this.isWin = false;
        this.second = false;
        this.ended = false;
        this.cost = 0;
        this.tickArray = [];
    }
    run(price, model) {
        if (!this.purchasePrice) {
            this.purchasePrice = price;
        } else {
            this.tickArray.push(price);
        }
        //console.log();
        // if (!this.second) this.checkSecond(price, model);
    }
    checkSecond(price, model) {
        if (!this.purchasePrice) this.purchasePrice = price;
        let change = Math.abs(this.purchasePrice - price);
        let changeBarrier = 1.7;
        if (this.prediction.prediction == 'CALL' && price < this.purchasePrice && change >= changeBarrier || this.prediction.prediction == 'PUT' && price > this.purchasePrice && change >= changeBarrier) {
            this.prediction = { prediction: price < this.purchasePrice ? 'PUT' : 'CALL', type: 'DIRECTION_SECOND' };
            this.second = true;
            model.createTransaction(this.prediction, [this.purchasePrice, price]);
        }
    }
};
