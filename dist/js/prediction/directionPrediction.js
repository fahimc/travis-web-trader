var DirectionPrediction = {
    lossStreak: 0,
    purchasePrice: 0,
    prediction: '',
    secondPrediction: '',
    tickCount: 0,
    secondDone: false,
    losing: false,
    secondCount:0,
    predict(ticks, checkMode) {
        
        if (Main.isProposal) {
            if(this.secondDone)return;
            let currentPrice = ticks[ticks.length - 1];
            if (!this.purchasePrice) this.purchasePrice = currentPrice;
            if (this.tickCount >= 1) {
                this.tickCount++;
                if (this.losing) {
                    this.secondPrediction = '';
                    if (this.purchasePrice > currentPrice) secondPrediction = 'PUT';
                    if (this.purchasePrice < currentPrice) secondPrediction = 'CALL';
                    if (secondPrediction) {
                        console.log('SECOND PREDICTION');
                        Main.isProposal = false;
                        Main.currentStake = Math.abs(Main.profit) * 0.5;
                        if (Main.currentStake < 0.35) Main.currentStake = 0.35;
                        //this.purchase(ticks, secondPrediction);
                    }
                    this.secondDone = true;
                    this.losing = false;
                }

                if (this.tickCount > 1 && this.prediction == 'CALL' && this.purchasePrice > currentPrice) this.losing = true;
                if (this.tickCount > 1 && this.prediction == 'PUT' && this.purchasePrice < currentPrice) this.losing = true;
            } else {
                this.tickCount++;
            }
            return;
        }
         this.secondDone = false;
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
            this.purchasePrice = 0;
            this.tickCount = 0;

            this.prediction = prediction;
            this.purchase(history, prediction);
            return true;
        }
    },
    purchase(history, prediction) {
        let collection = history.slice(history.length - 10, history.length);
        let highLow = Util.getHighLow(collection);
        ChartComponent.updatePredictionChart(collection, highLow.lowest, highLow.highest);
        Main.setPrediction(prediction, 'DIRECTION_' + prediction);
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
