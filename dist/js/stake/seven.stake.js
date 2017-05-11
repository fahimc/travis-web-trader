var SevenStake = {
  stake:{
    1: 0.50,
    2: 0.80,
    3: 1.80,
    4: 3.80,
    5: 7.50,
    6: 15.50,
    7: 32.00,
    8: 55.00,
    9: 100.00,
    10: 180.00,
    11: 300.00,
    12: 550.00,
    13: 1100.00,
    14: 2000.00,
    15: 4000.00,
    16: 8000.00
  },
  getStake(currentStake,lossCount) {
  	console.log('Seven Stake',this.stake[lossCount]);
  	return this.stake[lossCount] != undefined ? this.stake[lossCount] : currentStake * 2;
  }
};
