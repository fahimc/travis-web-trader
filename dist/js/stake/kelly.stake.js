var KellyStake = {
  maxStake:50,
  getStake(currentStake, lossCount) {
    let probability = MockMode.winPercentage
    let failure = 1 - probability;
    let odds = 2 - 1;
    let percentage = (probability * odds - failure) / odds;
    let stake = this.maxStake * percentage;
    console.log('stake', stake);
    if (stake) return stake;
  }
};
