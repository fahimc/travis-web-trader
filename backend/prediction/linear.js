var LinearPrediction = {
    isShowChange: false,
    predict(ticks, checkMode) {
        if (!checkMode && (!MockMode.toTrade || Main.isBreak || Main.isProposal || Main.pauseTrading)) return;
        let lastTick = ticks[ticks.length - 4];
        let previousTick = ticks[ticks.length - 2];
        let currentTick = ticks[ticks.length - 1];
        let highest = currentTick;
        let lowest = currentTick;
        let found = false;
        let collection = ticks.slice(ticks.length - 5, ticks.length);
        let change = ChartComponent.tradeChart30.getLinearChange();
        let isDirectionUp = ChartComponent.tradeChart30.getLinearDirection();
        let isShortDirectionUp = ChartComponent.tradeChart10.getLinearDirection();
        let changeLimit = Main.assetModel.linearChangeLimit;
        if (Main.lossStreak > 6) changeLimit = Main.assetModel.linearChangeLimit * 2;
        let isChange = change >= changeLimit;
        if (this.isShowChange) console.log(change);
        if (checkMode && isDirectionUp >= 0 && isShortDirectionUp >= 0 || isDirectionUp >= 0 && isShortDirectionUp >= 0 && isChange) {

            proposal = 'CALL';
            predictionType = 'LINEAR_UP';
            found = true;
            highest = currentTick;
            lowest = previousTick;
        } else if (checkMode && isDirectionUp < 0 && isShortDirectionUp < 0 || isDirectionUp < 0 && isShortDirectionUp < 0 && isChange) {

            proposal = 'PUT';
            predictionType = 'LINEAR_DOWN';
            found = true;
            highest = previousTick;
            lowest = currentTick;
        }
        if (found) {
            // Main.currentTrendItem = {
            //     predictionType: predictionType,
            //     type: proposal
            // };
            if (!checkMode) {
                Model.createTransaction(proposal, predictionType, currentTick, ticks.slice(ticks.length - 4, ticks.length));
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

        return (count / collection.length) >= 0.5;
    }
};
module.exports = LinearPrediction;