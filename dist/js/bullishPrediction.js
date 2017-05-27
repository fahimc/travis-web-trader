const BullishPrediction = {
    predict(ticks, checkMode) {
        if (!checkMode && (Main.isBreak || Main.isProposal || Main.pauseTrading)) return;
        let lastTick = ticks[ticks.length - 4];
        let previousTick = ticks[ticks.length - 2];
        let currentTick = ticks[ticks.length - 1];
        let highest = currentTick;
        let lowest = currentTick;
        let found = false;
        let priceDif = Math.abs(lastTick - currentTick)
        if (priceDif >= Main.assetModel.priceChangeBarrier && lastTick < previousTick && previousTick < currentTick) {
            this.isGoingInDirections(ticks.slice(ticks.length - 4, ticks.length), 'RAISE');
            proposal = 'CALL';
            predictionType = 'BULL_UP';
            found = true;
            highest = currentTick;
            lowest = previousTick;
        } else if (priceDif >= Main.assetModel.priceChangeBarrier && lastTick > previousTick && previousTick > currentTick) {
            this.isGoingInDirections(ticks.slice(ticks.length - 4, ticks.length), 'FALL');
            proposal = 'PUT';
            predictionType = 'BULL_DOWN';
            found = true;
            highest = previousTick;
            lowest = currentTick;
        }

        if (found) {
            Main.currentTrendItem = {
                predictionType: predictionType,
                type: proposal
            };
            if (!checkMode) {
               ChartComponent.updatePredictionChart(ticks.slice(ticks.length - 4, ticks.length), lowest, highest);
               Main.setPrediction(proposal, predictionType, checkMode);
            } else {
                return {
                    predictionType: predictionType,
                    type: proposal
                }
            }
        }

        return found;
    },
    isGoingInDirections(collection, direction) {
        let count = 0;
        collection.forEach((price, index) => {
            if (index == 0) return;
            price = Number(price);
            if (direction == 'RAISE' && collection[0] < price) count++;
            if (direction == 'FALL' && collection[0] > price) count++;
        });

        //console.log(count, count / collection.length, direction);
    }
}
