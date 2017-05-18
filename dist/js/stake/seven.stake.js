var SevenStake = {
  stake:{
    0: 0.50,
    1: 0.90,
    2: 1.90,
    3: 3.75,
    4: 7.70,
    5: 15.80,
    6: 32.60,
    7: 67.20,
    8: 125.00,
    9: 160.00,
    10: 95.00,
    11: 440.00,
    12: 750.00,
    13: 1000.00,
    14: 1000.00,
    15: 2000.00
  },
  getStake(currentStake,lossCount) {
  	console.log('Seven Stake',this.stake[lossCount]);
  	return this.stake[lossCount] != undefined ? this.stake[lossCount] : currentStake * 2;
  }
};
