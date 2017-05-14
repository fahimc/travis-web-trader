var SevenStake = {
  stake:{
    1: 0.50,
    2: 0.90,
    3: 1.90,
    4: 3.75,
    5: 7.70,
    6: 15.80,
    7: 32.60,
    8: 67.20,
    9: 125.00,
    10: 160.00,
    11: 95.00,
    12: 440.00,
    13: 750.00,
    14: 1000.00,
    15: 1000.00,
    16: 2000.00
  },
  getStake(currentStake,lossCount) {
  	console.log('Seven Stake',this.stake[lossCount]);
  	return this.stake[lossCount] != undefined ? this.stake[lossCount] : currentStake * 2;
  }
};
