var DirectionPrediction = {
    lossStreak: 0,
    predict(ticks, checkMode) {
        if (Main.isProposal) return;
        let model = {
            lossStreak: Main.lossStreak
        }
        return this.check(ticks, model);

    },
    check(history, model) {
        let collection = history.slice(history.length - 10, history.length);
        let previous = collection[0];
        let ups = 0;
        let downs = 0;
        collection.forEach((price) => {
            if (price > previous) ups++;
            if (price < previous) downs++;
            previous = price;
        });

        let total = ups + downs;
        let limit = 0.7;
        if (model.lossStreak > 3) limit = 0.9;

        let upPercentage = (ups / total);
        let downPercentage = (downs / total);
        let prediction = upPercentage > limit ? 'CALL' : (downPercentage > limit ? 'PUT' : '');
        if (prediction) {
            let collection = history.slice(history.length - 10, history.length);
            let highLow = Util.getHighLow(collection);
            ChartComponent.updatePredictionChart(collection, highLow.lowest, highLow.highest);
            Main.setPrediction(prediction, 'DIRECTION_' + prediction);
            return true;
        }
    },
    checkHistory(history, model) {
        let collection = history.slice(history.length - 60, history.length);
        let prediction = null;
        let count = 0;
        let wins = 0;
        let loses = 0;
        collection.forEach((price, index) => {
            if (prediction) {
                if (!count) prediction.purchasePrice = price;
                count++;
                if (count >= 6) {
                    if (prediction.prediction == 'CALL' && price > prediction.purchasePrice || prediction.prediction == 'PUT' && price < prediction.purchasePrice) {
                        wins++;
                    } else {
                        loses++;
                    }
                    prediction = null;
                    count = 0;
                }
            } else {
                let ticks = history.slice(0, index + 1);
                prediction = this.check(ticks, model);
            }
        });
        return wins / (wins + loses) > 0.52;
    }
};
