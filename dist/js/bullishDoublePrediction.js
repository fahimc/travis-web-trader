const BullishDoublePrediction = {
    pause: false,
    nextProposal: '',
    predict(ticks) {
        if (!this.nextProposal && (Main.isProposal || Main.pauseTrading)) return;
        let found = false;
        let proposal = '';
        let predictionType = '';
        let previousTick = ticks[ticks.length - 2];
        let currentTick = ticks[ticks.length - 1];
        let highest = currentTick;
        let lowest = currentTick;
        let isSecond=false;
        if (!this.nextProposal) {
            if (previousTick < currentTick) {
                this.nextProposal = 'CALL';
            } else if (previousTick > currentTick) {
                this.nextProposal = 'PUT';
            }
            proposal = this.nextProposal == 'CALL' ? 'PUT' : 'CALL';
            predictionType = 'BULL_' + proposal + '_OPP';
            found = true;

        } else {
            proposal = this.nextProposal;
            predictionType = this.nextProposal == 'CALL' ? 'BULL_UP' : 'BULL_DOWN';
            isSecond = true;
            found = true;
        }

        if (found) {

            Main.currentTrendItem = {
                predictionType: predictionType,
                type: proposal
            };
            Main.currentStake = Main.currentStake = Math.ceil(Math.abs(Main.profit) + (Math.abs(Main.profit) * 0.06));


            if (Main.currentStake < 0.4) Main.currentStake = Main.stake;
            //if(Main.currentStake > 20)Main.currentStake=Main.currentStake*0.5;
            View.updateStake(Main.currentStake, Main.lossLimit, Main.profitLimit);
            ChartComponent.updatePredictionChart([previousTick, currentTick], lowest, highest);
            if (isSecond) {
                Main.isProposal = false;
                this.nextProposal = '';
            }
            Main.setPrediction(proposal, predictionType);
           // Main.isProposal = true;

        }

        return found;
    }
}
