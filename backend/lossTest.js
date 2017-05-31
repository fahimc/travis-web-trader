const HISTORY = require('./historyData.json');
const DirectionPredictor = require('./prediction/direction.js');
const BullishPredictor = require('./prediction/bullish.js');
const PatternPredictor = require('./prediction/pattern.js');
const Model = require('./model/LossModel.js');

const Runner = {
    PREDICTOR:BullishPredictor,
    init() {
        this.run();
    },
    run() {
        let collection = HISTORY.slice(0,4000);
        collection.forEach((price, index) => {
            Model.runTransactions(price,index);
            let history = HISTORY.slice(0, index + 1);
            let prediction = this.PREDICTOR.predict(price, history, Model);
            if (prediction) {
                Model.createTransaction(prediction);
            }
            Model.numberOfTicks = index;
            if (index % 10000 ==0) {
                
            }

        });
        console.log('lose',Model.totalLoses/Model.count);
        console.log('win',Model.totalWins/Model.winCount);
        console.log('complete');
    }
}.init();
