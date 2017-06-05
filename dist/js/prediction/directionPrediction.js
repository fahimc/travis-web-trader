var DirectionPrediction = {
        lossStreak: 0,
        purchasePrice: 0,
        prediction: '',
        secondPrediction: '',
        tickCount: 0,
        secondDone: false,
        losing: false,
        secondCount: 0,
        predict(ticks, checkMode) {
            if (!checkMode && (!MockMode.toTrade || Main.isBreak || Main.isProposal || Main.pauseTrading)) return;

        let model = {
            lossStreak: Main.lossStreak
        }
        return this.check(ticks, model,checkMode);

    },
    check(history, model,checkMode) {
        let collection = history.slice(history.length - 10, history.length);
        let previous = collection[0];
        let currentTick = collection[collection.length - 1];
        let ups = 0;
        let downs = 0;
        collection.forEach((price) => {
            if (price > previous) ups++;
            if (price < previous) downs++;
            previous = price;
        });

        let total = ups + downs;
        let limit = 0.7;
        if (model.lossStreak > 3) {
            limit = 0.9;
            Main.stakeTicks = Main.LONG_TICK_LENGTH;
        }

        let upPercentage = (ups / total);
        let downPercentage = (downs / total);
        let prediction = upPercentage > limit && collection[0] < collection[collection.length - 1] ? 'CALL' : (downPercentage > limit && collection[0] > collection[collection.length - 1] ? 'PUT' : '');
        if (prediction) {
            this.purchasePrice = 0;
            this.tickCount = 0;

            this.prediction = prediction;
            if (!checkMode) {
                Model.createTransaction(prediction, 'DIRECTION_' + prediction, currentTick, collection);
            } else {
                return {
                    predictionType: predictionType,
                    type: prediction
                }
            }
            return true;
        }

    }
};
