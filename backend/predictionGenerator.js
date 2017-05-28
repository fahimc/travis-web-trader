let fs = require('fs');
let History = require('./history.js');

const Main = {
    transactions: [],
    init() {
        this.run();
    },
    run() {
        History.forEach((collection) => {
            this.runCollection(collection);
        });
        let similar = this.getSimilar();
        similar.sort(function(a, b) {
            return parseFloat(a.count) - parseFloat(b.count);
        });
        this.write(similar);
    },
    runCollection(collection) {
        let count = 0;
        let tickCount = 0;
        let transaction = false;
        let transactionTick = 0;
        let lastTenCollection = [];
        collection.forEach((price, index) => {
            if (transaction) {
                if (!tickCount) transactionTick = price;
                tickCount++;
                if (tickCount == 6) {
                    this.transactions.push({
                        past: lastTenCollection,
                        verdict: price > transactionTick ? 'CALL' : 'PUT'
                    });
                    transaction = false;
                    tickCount = 0;
                }
            } else {
                count++;
                if (count == 10) {
                    let ten = collection.slice(index - 9, index + 1);
                    lastTenCollection = this.normaliseTen(ten);
                    count = 0;
                    transaction = true;
                }
            }

        });

        // console.log(transactions);
    },
    write(collection) {
        fs.writeFile('predictions.json', JSON.stringify(collection, null, 2), 'utf8', null);
    },
    getSimilar() {
        let collection = [];
        this.transactions.forEach((obj, index) => {
            this.transactions.forEach((obj2, index2) => {
                if (obj.past.toString() == obj2.past.toString() && index !== index2 && obj.verdict  == obj2.verdict) {
                    // console.log(obj.past,obj2.past);
                    let found = false;
                    collection.forEach((_obj) => {
                        if (_obj.collection.toString() === obj.past.toString()) {
                            found = true;
                            _obj.count++;
                        }
                    });
                    if (!found) collection.push({ collection: obj.past, count: 1 , verdict:obj.verdict});
                }
            });
        });
        return collection;
        console.log(collection);
    },
    normaliseTen(collection) {
        let newCollection = [];
        collection.forEach((price) => {
            let greaterThanCount = 0;
            collection.forEach((_p) => {
                if (price > _p) greaterThanCount++;
            });
            newCollection.push(greaterThanCount);
        });
        return newCollection;
    }
}.init();
