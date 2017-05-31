const Balance = {
	stake:{
    0: 0.50,
    1: 0.90,
    2: 1.90,
    3: 3.75,
    4: 7.70,
    5: 15.80,
    6: 32.60,
    7: 67.20,
    8: 138.70,
    9: 260.00,
    10: 500.00,
    11: 440.00,
    12: 750.00,
    13: 1000.00,
    14: 1000.00,
    15: 2000.00
  },
  purchase(model){
    if(!model.balance)model.balance = model.STARTING_BALANCE;
    let cost = this.stake[model.lossStreak]  ? this.stake[model.lossStreak] : Math.abs(model.profit) * 2 ;
    model.profit -= cost;
    model.balance -= cost;
    return cost;
  }
}

module.exports = Balance;