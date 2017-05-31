var ParoliStake = {
  getStake(currentStake,lossCount,isLoss) {
  	if(!isLoss)
    {
      return currentStake * 2;
    }else{
      return 0.5;
    }
  }
};
