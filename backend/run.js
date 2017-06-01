const HISTORY = require('./historyData.json');
const DirectionPredictor = require('./prediction/direction.js');
const BullishPredictor = require('./prediction/bullish.js');
const PatternPredictor = require('./prediction/pattern.js');
const Model = require('./model/RunnerModel.js');

const Runner = {
    PREDICTOR:BullishPredictor,
    init() {
        this.run();
    },
    run() {

        HISTORY.forEach((price, index) => {
            Model.runTransactions(price);
            let history = HISTORY.slice(0, index + 1);
            let prediction = this.PREDICTOR.predict(price, history, Model);
            if (prediction) {
                Model.createTransaction(prediction);
            }
            Model.numberOfTicks = index;
            if (index % 10000 ==0) {
                console.log('days: ', ((((index * 2)/60)/60)/24).toFixed(2));
                console.log('number of ticks: ', index);
                console.log('wins: ', Model.winCount, '/ loses:', Model.lossCount);
                console.log('win ratio: ', Model.winCount / (Model.winCount + Model.lossCount));
                console.log('streak: ', Model.lossCollection);
                console.log('highestStake: £', Model.highestStake);
                console.log('max transactions: ', Model.highestNumberOfTransactions);
                console.log('profit: £', Model.balance.toFixed(2) - Model.STARTING_BALANCE);
            }

        });
        console.log('complete');
    }
}.init();
