const Model = {
    STARTING_BALANCE: 1100,
    LOSS_CAP: 9,
    balance: 0,
    numberOfTicks: 0,
    lossCollection: {},
    lossStreak: 0,
    lossCount: 0,
    highestStake: 0,
    profit: 0,
    winCount: 0,
    pendingTransactionsCollection: [],
    transactionCollection: [],
    highestNumberOfTransactions: 0,
    transactionIdIndex: 0,
    hasTransaction() {
        return this.transactionCollection.length;
    },
    runTransactions(price) {
        this.transactionCollection.forEach((transaction, index) => {
            transaction.run(price, this);
        });
    },
    setTransactionComplete(id,isLoss) {
      this.transactionCollection.forEach((transaction,index)=>{
        if(id == transaction.id)
        {
          this.transactionCollection.splice(index,1);
        }
      });
    },
    setTransactionID(id) {
      let transaction = this.pendingTransactionsCollection[0];
      this.pendingTransactionsCollection.shift();
      transaction.id = id;
      this.transactionCollection.push(transaction);
    },
    createTransaction(prediction, history) {
        let transaction = new Transaction(prediction, this);
        
        this.pendingTransactionsCollection.push(transaction);
        if (this.transactionCollection.length > this.highestNumberOfTransactions) this.highestNumberOfTransactions = this.transactionCollection.length;
        this.purchase(history, prediction);
    },
    purchase(history, prediction) {
        let collection = history.slice(history.length - 10, history.length);
        let highLow = Util.getHighLow(collection);
        ChartComponent.updatePredictionChart(collection, highLow.lowest, highLow.highest);
        Main.isProposal = false;
        Main.setPrediction(prediction.prediction, prediction.type);
    }
};
