let MockMode = {
    toTrade: false,
    prediction: null,
    purchasedTick: null,
    purchaseCount: 0,
    winCount: 0,
    lossCount: 0,
    winPercentage: 0,
    transactionCollection: [],
    countCollection: [],
    initialWinPercentageCap: 0.52,
    tightWinPercentageCap: 0.8,
    currentWinPercentageCap: 0.52,
    gettingHistory: false,
    assetCollection: [
        'R_100',
        'R_10',
        'R_25',
        'R_75',
        'RDBULL',
        'RDBEAR'
    ],
    IDLE_TICK_LIMIT: 10,
    lossStreak: 0,
    assetResultCollection: [],
    checkTimer: null,
    run(currentPrice,history) {
        this.checkHistory(history);
        //console.log('CURRENT WIN RATIO IS',this.winCount,this.lossCount,this.winCount/(this.winCount+this.lossCount));
        this.checkTrade();
        if (this.assetResultCollection.length >= this.assetCollection.length) {
            this.checkAssetResults();
        } else if(Main.lossStreak > this.lossStreak){
            this.lossStreak = Main.lossStreak;
            if (!this.checkTimer) this.checkTimer = setTimeout(() => {
                this.checkAssets();
                this.checkTimer = null;
            }, 5000);
        }

    },
    checkHistory(history){
        this.restart();
         this.transactionCollection=[];
        let collection = history.slice(history.length-10,history.length);
        collection.forEach((price)=>{
            this.checkTransactions(price);
            this.predict(price);
        });
    },
    checkAssetResults() {
        let best = this.assetResultCollection[0];
       // console.log('returnResult',this.assetResultCollection);
        this.assetResultCollection.forEach((item) => {
            if (item.winPercentage > best.winPercentage) best = item;
        });
      //  console.log('BEST ASSET', best);
        if (!Main.isProposal && best.asset !== Main.ASSET_NAME) {
            Main.changeAsset(best.asset);
            this.assetResultCollection = [];
            this.gettingHistory = false;
            console.log('SWITCH TO', best);
        } else {
            this.assetResultCollection = [];
            this.gettingHistory = false;
        }
    },
    checkAssets() {
      //  console.log('check',this.gettingHistory);
        if (this.gettingHistory) return;
        this.gettingHistory = true;
        this.assetResultCollection = [];
        this.assetCollection.forEach((asset) => {
            let checker = new AssetChecker(asset);
            checker.run();
        });
    },
    restart() {
        this.countCollection = [];
    },
    checkTrade() {

        let total = this.countCollection.length;
        let wins = this.numberOfWins();
        this.winPercentage = wins / total;
        if (isNaN(this.winPercentage)) this.winPercentage = 0;
        this.toTrade = Main.lossStreak >= 3 ? this.winPercentage >= this.tightWinPercentageCap : this.winPercentage >= this.currentWinPercentageCap;
        //this.toTrade = true;
        if (total > 5) {
            this.countCollection.shift();
        }
    },
    numberOfWins() {
        let wins = 0;
        this.countCollection.forEach((isWin) => {
            if (isWin) wins++;
        });
        return wins;
    },
    checkTransactions(currentPrice) {
        for (let a = 0; a < this.transactionCollection.length; a++) {
            let transaction = this.transactionCollection[a];
            transaction.run(currentPrice);
            if (transaction.complete) {
                this.transactionCollection.splice(a, 1);
                a--;
            }
        }
    },
    predict(currentPrice) {
        this.prediction = Main.predictionModel? window[Main.predictionModel].predict(Main.history[Main.history.length-1],Main.history,{}, true): BullishPrediction.predict(Main.history[Main.history.length-1],Main.history,{}, true);
        if (this.prediction) {
            let transaction = new TransactionMock(this.prediction.type, currentPrice, Main.stakeTicks);
            this.transactionCollection.push(transaction);
        }
    }
};

class TransactionMock {
    constructor(prediction, price, tickDuration) {
        this.complete = false;
        this.prediction = prediction;
        this.purchasedPrice = price;
        this.tickCount = tickDuration - 1;
    }
    run(price, returnResult) {
        this.tickCount--;
        if (!this.tickCount) {
            return this.checkPurchase(price, returnResult);
        }
    }
    checkPurchase(currentPrice, returnResult) {
        let win = 0;
        if (this.prediction == 'CALL' && this.purchasedPrice < currentPrice || this.prediction == 'PUT' && this.purchasedPrice > currentPrice) {
            win = 1;
        }
        this.complete = true;
        if (returnResult) {
            return win;
        }
        MockMode.countCollection.push(win);
    }

}

class AssetChecker {
    constructor(asset) {
        this.asset = asset;
    }

    run() {
        Main.getHistory(30, this.asset, this.onHistory.bind(this));
    }
    onHistory(data) {
        if (data.echo_req.ticks_history == this.asset) {
            let collection = data.history.prices;
            this.check(collection);

        }
    }
    check(collection) {
        let tickCount = 0;
        let transaction;
        let winCount = 0;
        let lossCount = 0;
        let lastTransactionIsWin = false;
        collection.forEach((price, index) => {
            price = Number(price);
            if (!transaction) {
                let prediction = Main.predictionModel ? window[Main.predictionModel].predict(collection.slice(0, index + 1), true) : BullishPrediction.predict(collection.slice(0, index + 1), true);
                if (prediction) {
                    transaction = new TransactionMock(prediction.type, price, Main.stakeTicks);
                }
            } else {
                let result = transaction.run(price, true);
                if (transaction.complete && result) {
                    lastTransactionIsWin = true;
                    winCount++;
                    transaction = null;
                } else if (transaction.complete) {
                    lastTransactionIsWin = false;
                    lossCount++;
                    transaction = null;
                }
            }

        });
      //  console.log(this.asset,winCount,lossCount);
        if (!lastTransactionIsWin) MockMode.assetResultCollection.push({ asset: this.asset, winPercentage: winCount / (this.asset, winCount + lossCount) });
    }
}
