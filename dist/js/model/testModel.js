const TestModel = {
  STRATEGIES: {
    LOSE: 'LOSE',
    HISTORY: 'HISTORY'
  },
  ENABLED: false,
  speed: 100,
  balance: 700,
  assets: [],
  strategy: 'HISTORY',
  history: {
    prices: [
      "11054.80",
      "11050.71",
      "11051.76",
      "11049.36",
      "11047.55",
      "11048.23",
      "11052.67",
      "11052.63",
      "11050.28",
      "11052.16",
      "11053.39",
      "11054.07",
      "11052.13",
      "11051.39",
      "11053.04",
      "11049.79",
      "11053.82",
      "11052.01",
      "11048.24",
      "11050.88"
    ],
    times: [
      "1494053580",
      "1494053582",
      "1494053584",
      "1494053586",
      "1494053588",
      "1494053590",
      "1494053592",
      "1494053594",
      "1494053596",
      "1494053598",
      "1494053600",
      "1494053602",
      "1494053604",
      "1494053606",
      "1494053608",
      "1494053610",
      "1494053612",
      "1494053614",
      "1494053616",
      "1494053618"
    ]
  },
  currentTick: 0,
  currentStake: 0,
  isBuy: false,
  tickDuration: 0,
  transactionCount: 0,
  transactionType: '',
  purchasedTick: 0,
  trend: 'RAISE',
  historicalTicks: [],
  historicalItemIndex: 0,
  historicalIndex: 0,
  getBalance() {
    if(!this.ENABLED)return;
    let balance = Storage.get(Storage.keys.balance);
    let startbalance = Storage.get(Storage.keys.startbalance);
    if (Number(balance)) {
      this.balance = Number(balance);
    } else {
      balance = this.balance;
    }
    console.log('test balance', balance);
    if (Number(startbalance) == NaN || startbalance == 'undefined') Storage.set(Storage.keys.startbalance,this.balance);
    return this.balance;
  },
  setBalance(balance) {
    if(!this.ENABLED)return;
    Storage.set(Storage.testPrefix + Storage.keys.balance, balance);
    this.balance = balance;
  },
  setHistory(collection) {
    this.historicalTicks = collection;
    let hItemIndex = Storage.get('historicalItemIndex');
    let hIndex = Storage.get('historicalIndex');
    if (!hIndex || hIndex != 'undefined') {
      this.historicalItemIndex = Number(hItemIndex);
      this.historicalIndex = Number(hIndex);
    }
    console.log('historicalIndex', this.historicalIndex);
  },
  getTick() {
    if (this.strategy == this.STRATEGIES.HISTORY) {
      if (this.historicalIndex >= this.historicalTicks[this.historicalItemIndex].length) {
        this.historicalItemIndex++;
      }
      if (!this.historicalTicks[this.historicalItemIndex]) {
        console.log('TEST ENDED')
        Main.ws.close();
        Storage.clearTest();
        Main.end(true);
        return null;
      }
      this.currentTick = this.historicalTicks[this.historicalItemIndex][this.historicalIndex];
      this.historicalIndex++;
    } else {
      this.currentTick = this.getTickByTrend();
    }
    return this.currentTick;
  },
  getTickByTrend() {
    let isTrend = Math.floor(Math.random() * (10 - 0 + 10) + 0);
    if (isTrend > 6) {
      if (this.trend == 'RAISE') return this.getRaise();
    } else {
      return this.getRandomTick();
    }
  },
  getRaise() {
    let min = this.currentTick + 1;
    let max = this.currentTick + 20;
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  getRandomTick() {
    let min = this.currentTick ? this.currentTick - 20 : 10054.80;
    let max = this.currentTick ? this.currentTick + 20 : 12054.80;
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  getResult() {
    let winAmount = TestModel.currentStake + (TestModel.currentStake * 0.94);
    switch (TestModel.strategy) {
      case this.STRATEGIES.LOSE:
        return '0.00';
        break;
      case this.STRATEGIES.HISTORY:
        let isWin = false;
        if (this.transactionType == 'CALL' && this.purchasedTick < this.currentTick || this.transactionType == 'PUT' && this.purchasedTick > this.currentTick) {
          return winAmount;
        } else {
          winAmount = '0.00';
          return winAmount;
        }
        break;
    }
  },
  end() {
    if(!this.ENABLED)return;
    if (this.strategy === this.STRATEGIES.HISTORY) {
      Storage.set('historicalItemIndex', this.historicalItemIndex);
      Storage.set('historicalIndex', this.historicalIndex);
      Storage.set('balance', this.balance);
      console.log(this.historicalItemIndex,this.historicalIndex);
    }
  }
};
