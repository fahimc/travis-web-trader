const KellyBalance = {
  maxStake:50,
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
    console.log(stake);
    if(stake)return stake;
  }
}

module.exports = KellyBalance;
