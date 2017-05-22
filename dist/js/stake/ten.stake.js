var TenStake = {
  stake:{
    0: 0.75,
    1: 1.00,
    2: 2.00,
    3: 4.10,
    4: 8.50,
    5: 17.50,
    6: 36.60,
    7: 75.20,
    8: 155.00,
    9: 310.00,
    10: 620.00,
    11: 1200.00,
    12: 2000.00,
    13: 4000.00,
    14: 8000.00,
    15: 16000.00
  },
  getStake(currentStake,lossCount) {
  	console.log('Ten Stake',this.stake[lossCount]);
  	return this.stake[lossCount] != undefined ? this.stake[lossCount] : currentStake * 2;
  }
};
