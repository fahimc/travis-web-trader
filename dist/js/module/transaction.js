class Transaction {
    constructor(prediction, predictionType, predictionPrice, ticks) {
        this.prediction = prediction;
        this.predictionType = predictionType;
        this.predictionPrice = predictionPrice;
        this.ticks = ticks;
        this.boundary = Util.getHighLow(ticks);
        this.transaction = null;
        this.buyPrice = null;
    }
    setPurchase(transaction) {
        this.transaction = transaction;
    }

};
