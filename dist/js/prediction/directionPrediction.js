var DirectionPrediction = {
    lossStreak: 0,
    predict(ticks, checkMode) {
        if (Main.isProposal) return;
        let collection = ticks.slice(ticks.length - 10, ticks.length);
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
        if (Main.lossStreak > 3) limit = 0.9;

        let upPercentage = (ups / total);
        let downPercentage = (downs / total);
        let prediction = upPercentage > limit ? 'CALL' : (downPercentage > limit ? 'PUT' : '');
        if (prediction) {
            let collection = ticks.slice(ticks.length - 2, ticks.length);
            let highLow = Util.getHighLow(collection);
            ChartComponent.updatePredictionChart(collection, highLow.lowest, highLow.highest);
            Main.setPrediction(prediction, 'DIRECTION_' + prediction);
        }
    }
};
