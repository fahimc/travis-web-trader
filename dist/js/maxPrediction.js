const MaxPrediction = {
    predict(ticks) {
        if (Main.isProposal || Main.pauseTrading) return;
        let collection = ticks.slice(ticks.length - 1000, ticks.length);
        let difference = Number(collection[0]) - Number(collection[collection.length - 1]);
        let highest = collection[0];
        let lowest = collection[0];
        let found = false;

        if (difference >= 60) {
            proposal = 'PUT';
            predictionType = 'MAX_DOWN';
            found = true;
            highest = collection[0];
            lowest = collection[collection.length - 1];
        } else if (difference <= 60) {
            proposal = 'CALL';
            predictionType = 'MAX_UP';
            found = true;
            highest = collection[collection.length - 1];
            lowest = collection[0];
        }

        if (found) {
            Main.currentTrendItem = {
                predictionType: predictionType,
                type: proposal
            };
            ChartComponent.updatePredictionChart([collection[0], collection[collection.length - 1]], lowest, highest);
            Main.setPrediction(proposal, predictionType);
        }

        return found;
    }
}
