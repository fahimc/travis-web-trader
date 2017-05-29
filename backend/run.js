const HISTORY = require('./historyData.json');
const PREDICTOR = require('./prediction/direction.js');
const Model = require('./model/RunnerModel.js');
const Transaction = require('./module/transaction.js');

const Runner = {
    init() {
        this.run();
    },
    run() {

        HISTORY.forEach((price, index) => {
            Model.runTransactions(price);
            let history = HISTORY.slice(0, index + 1);
            let prediction = PREDICTOR.predict(price, history, Model);
            if (prediction) {
                let transaction = new Transaction(prediction, Model);
                Model.transactionCollection.push(transaction);
            }
            Model.numberOfTicks = index;
            if (index % 10000 ==0) {
                console.log('number of ticks: ', index);
                console.log('wins: ', Model.winCount, '/ loses:', Model.lossCount);
                console.log('win ratio: ', Model.winCount / (Model.winCount + Model.lossCount));
                console.log('streak: ', Model.lossCollection);
            }

        });
        console.log('complete');
    }
}.init();
