const KellyBalance = {
  maxStake:100,
  setWin(model) {

  },
  setLoss() {

  },
  restart() {

  },
  purchase(model) {
    let probability = model.winRatio
    let failure = 1 - probability;
    let odds = 2 - 1;
    let percentage = (probability * odds - failure) / odds ;
    let stake = this.maxStake * percentage;
     if (stake < 0.5) stake = 0.5;
     return stake;
  }
}

module.exports = KellyBalance;
