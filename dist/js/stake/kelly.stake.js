var KellyStake = {
  maxStake:50,
  getStake(currentStake, lossCount) {
    let probability = MockMode.winPercentage;
    console.log(MockMode.winPercentage);
    let failure = 1 - probability;
    let odds = 2 - 1;
    let percentage = (probability * odds - failure) / odds;
    let stake = this.maxStake * percentage;
    if (stake < 0.5) stake = 0.5;
    console.log('stake', stake);
    return stake;
  }
};
