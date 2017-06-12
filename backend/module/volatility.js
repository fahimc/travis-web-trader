const Transaction = require('./transaction.js');
const Volatility = {
  winRatio: 0,
  run(history,model) {
  	this.checkWinPercentageOverPeriod(history,20,model);
  },
  checkWinPercentageOverPeriod(history,count,model) {
        let results = [];
        let transactions = [];
        let collection = history.slice(history.length - (count + 1), history.length);
        collection.forEach((currentPrice, index) => {
            currentPrice = Number(currentPrice);
            for (let a = 0; a < transactions.length; a++) {
                let transaction = transactions[a];
                transaction.run(currentPrice, model);
                if (transaction.ended) {
                    results.push(transaction.isWin?1:0)
                }
            }
            let h = collection.slice(0, index);
            let prediction = model.predictor.predict(currentPrice, h,model);
            if(prediction) {
            	let transaction = new Transaction(prediction, this);
            	transactions.push(transaction);
            }
        });
        model.winRatio =  this.winRatio= results.length ? this.numberOfWins(results)/results.length : 0;
    },
    numberOfWins(collection) {
        let wins = 0;
        if(!collection)collection = this.countCollection;
        collection.forEach((isWin) => {
            if (isWin) wins++;
        });
        return wins;
    },	
};

module.exports = Volatility;
