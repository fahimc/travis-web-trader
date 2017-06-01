const Balance = require('../module/Balance.js');
const Transaction = require('../module/transaction.js');

const RunnerModel = {
  STARTING_BALANCE: 1100,
  LOSS_CAP: 6,
  balance: 0,
  numberOfTicks: 0,
  lossCollection: {},
  lossStreak: 0,
  winStreak: 0,
  lossCount: 0,
  highestStake: 0,
  profit: 0,
  winCount: 0,
  transactionCollection: [],
  highestNumberOfTransactions: 0,
  doParoli: false,
  hasTransaction() {
    return this.transactionCollection.length;
  },
  runTransactions(price) {
    this.transactionCollection.forEach((transaction, index) => {
      transaction.run(price, this);
      if (transaction.ended) {
        this.transactionCollection.splice(index, 1);
        if (transaction.isWin) {
          this.setWin(transaction);
          this.lossStreak = 0;
          this.winCount++;
          this.winStreak++;
          if (this.doParoli) {
            if (this.balance - this.STARTING_BALANCE >= 0) {
                this.doParoli=false;
            } else {
              
            }
          }

        } else {
          this.lossStreak++;
          this.winStreak = 0;
          if (this.lossStreak) {
            if (!this.lossCollection[this.lossStreak]) this.lossCollection[this.lossStreak] = 0;
            this.lossCollection[this.lossStreak]++;
          }
          this.lossCount++;
          if (this.LOSS_CAP && this.lossStreak >= this.LOSS_CAP) {
            this.doParoli = true;
          }
        }
      }
    });
  },
  createTransaction(prediction) {
    let transaction = new Transaction(prediction, this);
    let cost = Balance.purchase(this);
    if (cost > this.highestStake) this.highestStake = cost;
    transaction.cost = cost;
    this.transactionCollection.push(transaction);
    if (this.transactionCollection.length > this.highestNumberOfTransactions) this.highestNumberOfTransactions = this.transactionCollection.length;
  },
  setWin(transaction) {
    this.balance += transaction.cost + (transaction.cost * 0.94);
    this.profit = 0;
  }
};

module.exports = RunnerModel;
