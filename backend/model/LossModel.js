const Balance = require('../module/Balance.js');
const Transaction = require('../module/transaction.js');

const LossModel = {
  STARTING_BALANCE: 1100,
  LOSS_CAP: 9,
  balance: 0,
  numberOfTicks: 0,
  lossCollection: {},
  lossStreak: 0,
  lossCount: 0,
  highestStake:0,
  profit: 0,
  winCount: 0,
  transactionCollection: [],
  highestNumberOfTransactions:0,
  totalWins:0,
  totalLoses:0,
  count:0,
  winCount:0,
  hasTransaction() {
    return this.transactionCollection.length;
  },
  runTransactions(price,i) {
    this.transactionCollection.forEach((transaction, index) => {
      transaction.run(price,this);
      if (transaction.ended) {
        this.transactionCollection.splice(index, 1);
          let collection = transaction.tickArray.slice(0,2);
        if (transaction.isWin) {
         this.totalWins += Math.abs(transaction.purchasePrice-collection[0]);
         this.winCount++;
         // console.log('--------win------');
          //console.log(Math.abs(transaction.purchasePrice-collection[0]));
        } else {
          //console.log('--------loss------');
          this.totalLoses += Math.abs(transaction.purchasePrice-collection[0]);
         this.count++;
        }
      }
    });
  },
  createTransaction(prediction) {
    let transaction = new Transaction(prediction, this);
    let cost = Balance.purchase(this);
    if(cost>this.highestStake)this.highestStake=cost;
    transaction.cost = cost;
    this.transactionCollection.push(transaction);
    if(this.transactionCollection.length > this.highestNumberOfTransactions)this.highestNumberOfTransactions=this.transactionCollection.length ;
  },
  setWin(transaction) {
    this.balance += transaction.cost + (transaction.cost * 0.94);
    this.profit = 0;
  }
};

module.exports = LossModel;
