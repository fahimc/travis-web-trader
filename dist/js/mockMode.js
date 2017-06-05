let MockMode = {
    toTrade: false,
    prediction: null,
    purchasedTick: null,
    purchaseCount: 0,
    winCount: 0,
    lossCount: 0,
    winPercentage: 0,
    currentWinPercentage: 0,
    transactionCollection: [],
    countCollection: [],
    initialWinPercentageCap: 0.56,
    tightWinPercentageCap: 0.60,
    currentWinPercentageCap: 0.56,
    shortWinPercentage: 0.65,
    gettingHistory: false,
    longTermWinRatio: 0.65,
    assetCollection: [
        'R_100',
        'R_10',
        'R_75',
        'RDBULL',
        'RDBEAR'
    ],
    IDLE_TICK_LIMIT: 10,
    lossStreak: 0,
    assetResultCollection: [],
    checkTimer: null,
    isAboveCap: false,
    currentisAboveCap: false,
    longWinCap: false,
    longWinRatio: 0,
    run(currentPrice) {
        this.checkTransactions(currentPrice);
        //console.log('overall win ratio is ',this.checkWinPercentageOverPeriod(100).toFixed(2) + '%');
        //console.log('CURRENT WIN RATIO IS',this.winCount,this.lossCount,this.winCount/(this.winCount+this.lossCount));
        this.checkTrade();
        if (this.assetResultCollection.length >= this.assetCollection.length) {
            this.checkAssetResults();
        } else if (Main.lossStreak > this.lossStreak) {
            this.lossStreak = Main.lossStreak;
            if (!this.checkTimer) this.checkTimer = setTimeout(() => {
                this.checkAssets();
                this.checkTimer = null;
            }, 5000);
        }

    },
    checkAssetResults() {
        let best = this.assetResultCollection[0];
        // console.log('returnResult',this.assetResultCollection);
        this.assetResultCollection.forEach((item) => {
            if (item.winPercentage > best.winPercentage) best = item;
        });
        console.log('BEST ASSET', best);
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
    getMessage() {
        let message = 'Number of transactions ' + this.countCollection.length;
        if (!this.longWinCap) return 'long term win percentage is ' + (this.longWinRatio * 100).toFixed(2) + '%';
        if (!this.isAboveCap) return 'win percentage is ' + (this.winPercentage * 100).toFixed(2) + '%';
        if (!this.currentisAboveCap) return 'short win percentage is ' + (this.currentWinPercentage * 100).toFixed(2) + '%';
        return message;
    },
    checkTrade() {
        let total = this.countCollection.length;
        let wins = this.numberOfWins();
        this.winPercentage = wins / total;
        if (isNaN(this.winPercentage)) this.winPercentage = 0;
        this.isAboveCap = Main.lossStreak >= 3 ? this.winPercentage >= this.tightWinPercentageCap : this.winPercentage >= this.currentWinPercentageCap;
        this.currentisAboveCap = this.isWinsByIndex(3, this.shortWinPercentage);
        this.longWinCap = true;
        if(Main.lossStreak>6)
        {
           this.longWinRatio = this.checkWinPercentageOverPeriod(100);
           this.longWinCap = this.longWinRatio > this.longTermWinRatio;
        }
          this.toTrade = this.isAboveCap && this.currentisAboveCap && this.longWinCap;
        
        this.updateToTrade();
        //this.toTrade = false;
    },
    updateToTrade() {
        if (!this.toTrade) {
            Main.pauseTrading = true;
            View.updateVolatile(true, this.getMessage());
        } else {
            Main.pauseTrading = false;
            View.updateVolatile(false, '');
        }
    },
    isWinsByIndex(count, percentage) {
        let collection = this.countCollection.slice(this.countCollection.length - (count + 1), this.countCollection.length);
        let wins = 0;
        collection.forEach((isWin) => {
            if (isWin) wins++;
        });
        this.currentWinPercentage = (wins / collection.length);
        return this.currentWinPercentage > percentage;
    },
    numberOfWins(collection) {
        let wins = 0;
        if(!collection)collection = this.countCollection;
        collection.forEach((isWin) => {
            if (isWin) wins++;
        });
        return wins;
    },
    checkTransactions() {
        MockMode.countCollection = [];
        let collection = Main.history.slice(Main.history.length - 20, Main.history.length);
        collection.forEach((currentPrice, index) => {
            currentPrice = Number(currentPrice);
            for (let a = 0; a < this.transactionCollection.length; a++) {
                let transaction = this.transactionCollection[a];
                transaction.run(currentPrice);
                if (transaction.complete) {
                    this.transactionCollection.splice(a, 1);
                    a--;
                }
            }
            let h = collection.slice(0, index);
            this.predict(currentPrice, h);
        });

    },
    checkWinPercentageOverPeriod(count) {
        let results = [];
        let transactions = [];
        let collection = Main.history.slice(Main.history.length - (count + 1), Main.history.length);
        collection.forEach((currentPrice, index) => {
            currentPrice = Number(currentPrice);
            for (let a = 0; a < transactions.length; a++) {
                let transaction = transactions[a];
                let result = transaction.run(currentPrice, true);
                if (result !== undefined) {
                    results.push(result)
                }
            }
            let h = collection.slice(0, index);
            let transaction = this.predict(currentPrice, h,true);
            if(transaction)transactions.push(transaction);
        });
        return this.numberOfWins(results)/results.length;
    },
    predict(currentPrice, collection, returnResult) {
        this.prediction = Main.predictionModel ? window[Main.predictionModel].predict(collection, true) : BullishPrediction.predict(collection, true);
        if (this.prediction) {
            let transaction = new TransactionMock(this.prediction.type, currentPrice, Main.stakeTicks);
            if (returnResult) {
              return transaction;
            } else {
                this.transactionCollection.push(transaction);
            }
        }
    }
};

class TransactionMock {
    constructor(prediction, price, tickDuration) {
        this.complete = false;
        this.prediction = prediction;
        this.purchasedPrice = null;
        this.tickCount = tickDuration;
    }
    run(price, returnResult) {
        if (!this.purchasedPrice) this.purchasedPrice = price;
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
        } else {
            MockMode.countCollection.push(win);
        }
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
