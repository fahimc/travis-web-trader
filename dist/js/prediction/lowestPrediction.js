var LowestPrediction = {
    predict(ticks, checkMode) {
        if (!checkMode && (Main.isBreak || Main.isProposal || Main.pauseTrading)) return;
        let found = false;
        let proposal = '';
        let currentTick = Number(ticks[ticks.length - 1]);
        let predictionType = 'LOWEST_PRICE';
        if (Storage.lowestPrices[Main.ASSET_NAME] <= currentTick) {
            found = true;
            proposal = 'CALL';
        }
        if (found) {
            if (!checkMode) {
              Main.durationUnit = 's';
                Model.createTransaction(proposal, predictionType, currentTick, ticks.slice(ticks.length - 4, ticks.length), '30', 's');
            } else {
                return {
                    predictionType: predictionType,
                    type: proposal
                }
            }
        }

        return found;
    }
}
