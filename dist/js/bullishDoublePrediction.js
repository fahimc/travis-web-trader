const BullishDoublePrediction = {
  isFisrtPrediction: '',
  pause: false,
  predict(ticks) {
    if (Main.isProposal || Main.pauseTrading) return;
    let found = false;
    let proposal = '';
    let predictionType = '';
    let previousTick = ticks[ticks.length - 2];
    let currentTick = ticks[ticks.length - 1];
    let highest = currentTick;
    let lowest = currentTick;
    if (this.isFisrtPrediction) {
      proposal = this.isFisrtPrediction == 'CALL' ? 'PUT' : 'CALL';
      predictionType = 'BULL_' + proposal + '_SECOND';
      found = true;

    } else {
      if (previousTick < currentTick) {
        proposal = 'CALL';
        predictionType = 'BULL_UP';
        found = true;
        highest = currentTick;
        lowest = previousTick;
      } else if (previousTick > currentTick) {
        proposal = 'PUT';
        predictionType = 'BULL_DOWN';
        found = true;
        highest = previousTick;
        lowest = currentTick;
      }
    }

    if (found) {
      Main.currentTrendItem = {
        predictionType: predictionType,
        type: proposal
      };
      let profit = Math.abs(Main.profit) * 0.5;
      let stake = profit;
      Main.currentStake = stake + (stake * 0.1);
      if (Main.currentStake < 0.4) Main.currentStake = Main.stake;

      ChartComponent.updatePredictionChart([previousTick, currentTick], lowest, highest);
      //if (this.isFisrtPrediction) Main.isProposal = false;
      Main.setPrediction(proposal == 'CALL' ? 'PUT' : 'CALL', predictionType);
      View.updateStake(Main.currentStake, Main.lossLimit, Main.profitLimit);
      Main.isProposal = false;

      stake = (profit + Main.currentStake) * 0.5;
      Main.currentStake = (stake + (stake * 0.2)) * 2;
      if (Main.currentStake <= 0.5) Main.currentStake = 0.6;

      Main.setPrediction(proposal, predictionType);
      //Main.isProposal = true;
      View.updateStake(Main.currentStake, Main.lossLimit, Main.profitLimit);


      // this.isFisrtPrediction = this.isFisrtPrediction ? '' : proposal;    
    }

    return found;
  }
}
