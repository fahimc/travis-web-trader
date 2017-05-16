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
      let stake = (Math.abs(Main.profit)) * 0.5;
      Main.currentStake = stake + (stake * 0.07);
      if (Main.currentStake < 0.4) Main.currentStake = 0.5;
      // Main.currentStake = stake + (stake *0.07);
      //if (this.isFisrtPrediction) Main.currentStake = stake + (stake *0.07);
      // console.log('bull stake',Main.currentStake);
      ChartComponent.updatePredictionChart([previousTick, currentTick], lowest, highest);
      //if (this.isFisrtPrediction) Main.isProposal = false;
      Main.setPrediction(proposal == 'CALL' ? 'PUT' : 'CALL', predictionType);
      Main.isProposal = false;

      stake = (Math.abs(Main.profit) + Main.currentStake) * 0.5;
      Main.currentStake = stake + (stake * 0.07);
      if (Main.currentStake <= 0.5) Main.currentStake = 0.5;
      Main.setPrediction(proposal, predictionType);
      Main.isProposal = true;
      View.updateStake(Main.currentStake, Main.lossLimit, Main.profitLimit);


      // this.isFisrtPrediction = this.isFisrtPrediction ? '' : proposal;    
    }

    return found;
  }
}
