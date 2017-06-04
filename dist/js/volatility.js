const Volatility = {
    tickCollection: [],
    duration: 1000,
    priceChangeDuration: 30,
    priceChangeBarrier: 10,
    changeLimit: 12,
    defaultChangeLimit: 12,
    defaultChangeTightLimit: 10,
    timer: null,
    changeCounts: [],
    check(price, override) {
        this.setDefaults();
        if (!this.timer && !override) {
            this.start();
        } else {
            this.tickCollection.push(price);
        }
    },
    setDefaults(){
        if(Main.assetModel)
        {
            this.priceChangeBarrier = Main.assetModel.priceChangeBarrier;   
        }
    },
    start() {
        this.tickCollection = [];
        this.timer = setTimeout(() => {
            this.end();
        }, this.duration);
    },
    end(collection) {
        let change = this.priceChangeSmall(collection);
        let changeCount = this.numberOfChanges(collection);
       // if (!MockMode.toTrade || changeCount > this.changeLimit||change) {
        if (!MockMode.toTrade) {
           // Main.pauseTrading = true;
            change = change?change:0;
            let message = changeCount > this.changeLimit ? 'direction changes:' + changeCount : 'price change: ' + change.toFixed(2);
            if(!MockMode.toTrade)message = '<br>' + MockMode.getMessage();
           // View.updateVolatile(true, message); 
        } else {
           // Main.pauseTrading = false;
            //View.updateVolatile(false, '');
        }
        this.timer = null;
        this.tickCollection = [];
    },
    isVolatile() {
        let bottomCollection = [];
        let previousPrice = this.tickCollection[0];
        let topCollection = [];
        // find top and bottom prices
        this.tickCollection.forEach(function(price, index) {
            if (index > 1) {
                if (price > previousPrice && previousPrice < this.tickCollection[index - 2]) bottomCollection.push(previousPrice);
                if (price < previousPrice && previousPrice > this.tickCollection[index - 2]) topCollection.push(previousPrice);
            }
            previousPrice = price;
        }.bind(this));

        //console.log('change', bottomCollection.length, topCollection.length);
        if (bottomCollection.length < 2 && topCollection.length < 2) return false;
        return true;
    },
    mean(_collection) {
        let ticks = _collection ? _collection : Main.history;
        let collection = ticks.slice(ticks.length - 1000, ticks.length);
        let sum = 0;
        collection.forEach((price) => {
            sum += Number(price);
        });
        let mean = sum / collection.length;
        console.log(mean,collection[0] - collection[collection.length-1]);
    },
    numberOfChanges(_collection) {
        let ticks = _collection ? _collection : Main.history;
        let collection = ticks.slice(ticks.length - 30, ticks.length);
        let changeCount = 0;
        let previousPrice = collection[0];
        let direction = collection[0] > collection[1] ? 'RAISE' : 'FALL';
        collection.forEach(function(price, index) {
            if (index > 1) {
                if (price > previousPrice && direction != 'RAISE') changeCount++;
                if (price < previousPrice && direction != 'FALL') changeCount++;
            }
            previousPrice = price;
        }.bind(this));
        this.changeCounts.push(changeCount);
        // console.log('changeCount',changeCount);
        return changeCount;
    },
    averageChangeCounts() {
        let sum = 0;
        let lowest = this.changeCounts[0];
        let highest = this.changeCounts[0];
        this.changeCounts.forEach(function(count) {
            sum += count;
            if (count < lowest) lowest = count;
            if (count > highest) highest = count;
        }.bind(this));

        console.log(sum / this.changeCounts.length);
        console.log(lowest, highest);
    },
    priceChangeSmall(_ticks) {
        let ticks = _ticks ? _ticks : Main.history;
        let collection = ticks.slice(ticks.length - (this.priceChangeDuration + 1), ticks.length);
        let lastPrice = collection[0];
        let currentPrice = collection[collection.length - 1];
        //console.log('Volatile Dif', Math.abs(lastPrice - currentPrice),this.priceChangeBarrier)
        if (Math.abs(lastPrice - currentPrice) < this.priceChangeBarrier) return Math.abs(lastPrice - currentPrice);
        return false;
    }
};
