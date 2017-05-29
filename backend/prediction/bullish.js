const Prediction = {
    predict(price, history, model) {
        if (model.isBreak || model.hasTransaction() || model.pauseTrading) return;
        let marketIsGood = this.checkHistory(history);
        if(marketIsGood)return this.check(history);
    },
    check(history) {
        let lastTick = history[history.length - 4];
        let previousTick = history[history.length - 2];
        let currentTick = history[history.length - 1];
        let highest = currentTick;
        let lowest = currentTick;
        let found = false;
        if (lastTick < previousTick && previousTick > currentTick) {
            proposal = 'CALL';
            predictionType = 'BULL_UP';
            found = true;
            highest = currentTick;
            lowest = previousTick;
        } else if (lastTick > previousTick && previousTick < currentTick) {
            proposal = 'PUT';
            predictionType = 'BULL_DOWN';
            found = true;
            highest = previousTick;
            lowest = currentTick;
        }

        if (found) {
            let collection = history.slice(history.length - 2, history.length);
            return { prediction: proposal, type: predictionType };
        }

        return found;
    },
    checkHistory(history) {
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
                prediction = this.check(ticks);
            }
        });
        return wins/(wins+loses) >= 0.52;
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
};

module.exports = Prediction;
