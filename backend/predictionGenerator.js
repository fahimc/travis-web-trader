let fs = require('fs');
let History = require('./historyData.json');
let Transaction = require('./transaction.js');

const Main = {
    transactions: [],
    init() {
        this.run();
    },
    run() {
        this.runCollection(History);
        let similar = this.getSimilar();
        console.log('sort');
        similar.sort(function(a, b) {
            return parseFloat(a.count) - parseFloat(b.count);
        });
        this.write(similar);
    },
    runCollection(collection) {
        console.log('runCollection');
        let lastTenCollection = [];
        collection.forEach((price, index) => {
            this.transactions.forEach((transaction) => {
                transaction.run(price);
            });
            if (index >= 10) {
                let ten = collection.slice(index - 10, index);
                lastTenCollection = this.normaliseTen(ten);
                let transaction = new Transaction(price, lastTenCollection);
                this.transactions.push(transaction);
            }
            // if (transaction) {
            //     if (!tickCount) transactionTick = price;
            //     tickCount++;
            //     if (tickCount == 6) {
            //         this.transactions.push({
            //             past: lastTenCollection,
            //             verdict: price > transactionTick ? 'CALL' : 'PUT'
            //         });
            //         transaction = false;
            //         tickCount = 0;
            //     }
            // } else {
            //     count++;
            //     if (count == 10) {
            //         let ten = collection.slice(index - 9, index + 1);
            //         lastTenCollection = this.normaliseTen(ten);
            //         count = 0;
            //         transaction = true;
            //     }
            // }

        });

    },
    write(collection) {
        console.log('write');
        fs.writeFile('predictions.json', JSON.stringify(collection, null, 2), 'utf8', null);
    },
    getSimilar() {
        console.log('getSimilar', this.transactions.length);
        let collection = [];
        let hashTable = {};
        this.transactions.forEach((obj, index) => {
            let key = obj.pastCollection.toString().replace(',', '_') + '_' + obj.verdict;
            if (hashTable[key]) {
                hashTable[key].count++;
            } else {
                hashTable[key] = {
                    collection: obj.pastCollection,
                    verdict: obj.verdict,
                    count: 0
                }
            }
        });
        console.log('convert hashTable');
        for (let key in hashTable) {
            collection.push(hashTable[key]);
        }
        return collection;
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
