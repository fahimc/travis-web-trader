var SevenStake = {
  stake:{
    1: 0.50,
    2: 0.80,
    3: 1.80,
    4: 3.80,
    5: 7.50,
    6: 15.50,
    7: 31.90,
    8: 65.80,
    9: 135.80,
    10: 260.00,
    11: 440.00,
    12: 750.00,
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
