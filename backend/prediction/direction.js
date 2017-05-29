const Prediction = {
    predict(price, history, model) {
        if(model.hasTransaction())return;
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
            let collection = history.slice(history.length - 2, history.length);
            return { prediction: prediction, type: 'DIRECTION_' + prediction };
        }
    }
};

module.exports = Prediction;
