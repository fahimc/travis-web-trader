var ElevenStake = {
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
    11: 840.00
  },
  getStake(currentStake,lossCount) {
  	console.log('Eleven Stake',this.stake[lossCount]);
  	return this.stake[lossCount] != undefined ? this.stake[lossCount] : currentStake * 2;
  }
};
