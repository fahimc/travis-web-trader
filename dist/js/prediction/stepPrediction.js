var StepPrediction = {
    predict(ticks,checkMode) {
        if (!checkMode && (Main.isBreak || Main.isProposal || Main.pauseTrading)) return;
        let found = false;
        let shortRange = ticks.slice(ticks.length - 10, ticks.length);
        let collection = this.getRaises(shortRange);
       // let dropcollection = this.getDrop(shortRange);
        let highLow = Util.getHighLow(collection);
        if (collection.length > 1 && shortRange[shortRange.length-2] > shortRange[shortRange.length-1]) {
            found = true;
            let predictionType = 'STEP_UP';
            let proposal = 'CALL';
            if (!checkMode) {
                ChartComponent.updatePredictionChart(collection, highLow.lowest, highLow.highest);
                Main.setPrediction(proposal, predictionType);
            } else {
                return {
                    predictionType: predictionType,
                    type: proposal
                }
            }
        }

        /*
        let lastTick = ticks[ticks.length-4];
        let previousTick = ticks[ticks.length-2];
        let currentTick = ticks[ticks.length-1];
        let highest = currentTick;
        let lowest = currentTick;
        let found= false;
        if (lastTick < previousTick && previousTick < currentTick) {
            proposal = 'CALL';
            predictionType = 'BULL_UP';
            found = true;
            highest = currentTick;
            lowest = previousTick;
        } else if (lastTick > previousTick && previousTick > currentTick) {
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
            
            Main.setPrediction(proposal, predictionType);
        }

        */
        return found;
    },
    getDrops(collection) {
        let previous = collection[0];
        let bottoms = [];
        collection.forEach((price, index) => {
            if (index > 1 && previous > price && previous > collection[index - 2]) {
                bottoms.push(previous);
            }
            previous = price;
        });
        bottoms.forEach((price, index) => {
            let next = bottoms[index + 1];
            if (next && price > next) {
                bottoms.splice(index, 1);
            }
        });

        return bottoms;
    },
    getRaises(collection) {
        let previous = collection[0];
        let bottoms = [];
        collection.forEach((price, index) => {
            if (index > 1 && previous < price && previous > collection[index - 2]) {
                bottoms.push(previous);
            }
            previous = price;
        });
        bottoms.forEach((price, index) => {
            let next = bottoms[index + 1];
            if (next && price > next) {
                bottoms.splice(index, 1);
            }
        });
        return bottoms;
    }
}
