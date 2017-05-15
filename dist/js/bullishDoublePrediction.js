const BullishDoublePrediction = {
    isFisrtPrediction: '',
    pause: false,
    predict(ticks) {
        if (!this.isFisrtPrediction && (Main.isProposal || Main.pauseTrading)) return;
        if (this.pause) return;
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
            if (Main.currentStake >= 1) Main.currentStake = Main.currentStake * 0.5;
            if(Main.currentStake < 0.4)Main.currentStake = 0.5;
            console.log('bull stake',Main.currentStake);
            ChartComponent.updatePredictionChart([previousTick, currentTick], lowest, highest);
            if (this.isFisrtPrediction) Main.isProposal = false;
            Main.setPrediction(proposal, predictionType);
             Main.isProposal = true;
            if (this.isFisrtPrediction) {
                this.pause = true;
                setTimeout(() => {
                    this.pause = false;
                }, 10);
            }

            this.isFisrtPrediction = this.isFisrtPrediction ? '' : proposal;
        }

        return found;
    }
}
