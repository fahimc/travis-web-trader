const Balance = require('../module/atila_balance.js');
const Transaction = require('../module/transaction.js');

const RunnerModel = {
  ASSET_NAME: 'R_100',
  STARTING_BALANCE: 1100,
  TRANSACTION_DURATION: 6,
  predictor: null,
  LOSS_CAP: 9,
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
  paroliIndex: 0,
  maxParoliIndex: 0,
  lowestPrices: {
    'R_100': 0
  },
  lowestProfit:99999,
  hasTransaction() {
    return this.transactionCollection.length;
  },
  runTransactions(price) {
    let removeCollection = [];
    this.transactionCollection.forEach((transaction, index) => {
      transaction.run(price, this);
      if (transaction.ended) {
        removeCollection.push(index);
        if (transaction.isWin) {
          this.setWin(transaction);
          Balance.setWin(this);
          this.lossStreak = 0;
          this.winCount++;
          this.winStreak++;

        } else {
          this.lossStreak++;
          this.winStreak = 0;
          Balance.setLoss();
          if (this.lossStreak) {
            if (!this.lossCollection[this.lossStreak]) this.lossCollection[this.lossStreak] = 0;
            this.lossCollection[this.lossStreak]++;
          }
          this.lossCount++;
          if (this.LOSS_CAP && this.lossStreak >= this.LOSS_CAP) {
          }
        }
      }
    });
    removeCollection.forEach((index) => {
      this.transactionCollection.splice(index, 1);
    });
  },
  createTransaction(prediction) {
    let transaction = new Transaction(prediction, this);
    let cost = Balance.purchase(this);
    if (cost > this.highestStake) this.highestStake = cost;
    transaction.cost = cost;
    this.setBalance(cost);
    this.transactionCollection.push(transaction);
    if (this.transactionCollection.length > this.highestNumberOfTransactions) this.highestNumberOfTransactions = this.transactionCollection.length;
  },
  setBalance(cost) {
    if (!this.balance) this.balance = this.STARTING_BALANCE;
    this.profit -= cost;
    if(this.lowestProfit > this.profit)this.lowestProfit = this.profit;
    this.balance -= cost;
  },
  setWin(transaction) {
    let winnings = transaction.cost + (transaction.cost * 0.94);
    this.balance += winnings;
    this.profit = 0;
  }
};

module.exports = RunnerModel;
