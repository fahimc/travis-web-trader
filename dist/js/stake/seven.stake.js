var SevenStake = {
  stake:{
    1: 0.50,
    2: 0.80,
    3: 1.80,
    4: 3.80,
    5: 7.50,
    6: 15.50,
    7: 32.00,
    8: 48.00,
    9: 60.00,
    10: 80.00,
    11: 100.00,
    12: 150.00,
    13: 200.00,
    14: 200.00,
    15: 500.00,
    16: 500.00
  },
  getStake(currentStake,lossCount) {
  	console.log('Seven Stake',this.stake[lossCount]);
  	return this.stake[lossCount] != undefined ? this.stake[lossCount] : currentStake * 2;
  }
};
