const BullishPrediction = {
    doMultiple: false,
    multipleCount: 0,
    predict(ticks, checkMode) {
        if (!this.doMultiple && !checkMode && (Main.isProposal || Main.pauseTrading)) return;
        let lastTick = ticks[ticks.length - 4];
        let previousTick = ticks[ticks.length - 2];
        let currentTick = ticks[ticks.length - 1];
        let highest = currentTick;
        let lowest = currentTick;
        let found = false;
        if (lastTick < previousTick && previousTick < currentTick) {
            this.isGoingInDirections(ticks.slice(ticks.length - 4, ticks.length), 'RAISE');
            proposal = 'CALL';
            predictionType = 'BULL_UP';
            found = true;
            highest = currentTick;
            lowest = previousTick;
        } else if (lastTick > previousTick && previousTick > currentTick) {
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
                if(this.doMultiple)Main.isProposal = false;
                Main.setPrediction(proposal, predictionType, checkMode, this.doMultiple?Main.stake:null);
                
                if (Main.lossStreak >= 1 && !this.doMultiple) {
                    this.doMultiple = true;
                } else if (this.doMultiple) {
                    this.multipleCount++;
                    if (this.multipleCount > 4) {
                        this.doMultiple = false;
                        this.multipleCount = 0;
                    }
                }
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
