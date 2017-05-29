const Prediction = {
    prediction: null,
    second: false,
    predict(price, history, model) {
        if (model.hasTransaction()) return;
        let found = false;
        let collection = history.slice(history.length - 10, history.length);
        let normailisedCollection = this.normaliseTen(collection);
        found = this.findMatch(normailisedCollection, collection);

        return found;
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
    },
    findMatch(pattern, collection) {
        let found = false;
        PATTERNS.forEach((obj) => {
            if (pattern.toString() == obj.collection.toString()) {
            let prediction = { prediction: obj.verdict, type: 'PATTERN_' + obj.verdict + '_' + obj.count };
                found = prediction;
            }
        });

        return found;
    }
};

var PATTERNS = [

    {
        "collection": [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9
        ],
        "verdict": "PUT",
        "count": 1253
    },
      {
    "collection": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      8,
      9,
      7
    ],
    "verdict": "PUT",
    "count": 359
  },
  {
    "collection": [
      7,
      9,
      8,
      6,
      5,
      4,
      3,
      2,
      1,
      0
    ],
    "verdict": "CALL",
    "count": 363
  },
  {
    "collection": [
      0,
      1,
      2,
      3,
      5,
      4,
      6,
      7,
      8,
      9
    ],
    "verdict": "PUT",
    "count": 365
  },
  {
    "collection": [
      9,
      8,
      7,
      6,
      5,
      4,
      3,
      1,
      2,
      0
    ],
    "verdict": "CALL",
    "count": 371
  },
  {
    "collection": [
      0,
      1,
      2,
      3,
      5,
      4,
      6,
      7,
      8,
      9
    ],
    "verdict": "CALL",
    "count": 372
  },
  {
    "collection": [
      0,
      1,
      2,
      3,
      4,
      5,
      7,
      6,
      8,
      9
    ],
    "verdict": "PUT",
    "count": 373
  },
  {
    "collection": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      8,
      7,
      9
    ],
    "verdict": "CALL",
    "count": 377
  },
  {
    "collection": [
      0,
      1,
      2,
      3,
      4,
      5,
      7,
      6,
      8,
      9
    ],
    "verdict": "CALL",
    "count": 377
  },
  {
    "collection": [
      0,
      1,
      3,
      2,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "verdict": "CALL",
    "count": 379
  },
  {
    "collection": [
      0,
      1,
      2,
      3,
      4,
      6,
      5,
      7,
      8,
      9
    ],
    "verdict": "CALL",
    "count": 380
  },
  {
    "collection": [
      9,
      8,
      7,
      6,
      5,
      4,
      2,
      3,
      1,
      0
    ],
    "verdict": "PUT",
    "count": 380
  },
  {
    "collection": [
      0,
      2,
      1,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "verdict": "PUT",
    "count": 381
  },
  {
    "collection": [
      9,
      8,
      7,
      5,
      6,
      4,
      3,
      2,
      1,
      0
    ],
    "verdict": "PUT",
    "count": 381
  },
  {
    "collection": [
      9,
      8,
      7,
      5,
      6,
      4,
      3,
      2,
      1,
      0
    ],
    "verdict": "CALL",
    "count": 381
  },
  {
    "collection": [
      9,
      8,
      7,
      6,
      4,
      5,
      3,
      2,
      1,
      0
    ],
    "verdict": "PUT",
    "count": 382
  },
  {
    "collection": [
      9,
      8,
      7,
      6,
      5,
      3,
      4,
      2,
      1,
      0
    ],
    "verdict": "CALL",
    "count": 385
  },
  {
    "collection": [
      0,
      2,
      1,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "verdict": "CALL",
    "count": 386
  },
  {
    "collection": [
      9,
      8,
      6,
      7,
      5,
      4,
      3,
      2,
      1,
      0
    ],
    "verdict": "CALL",
    "count": 386
  },
  {
    "collection": [
      0,
      1,
      2,
      3,
      4,
      6,
      5,
      7,
      8,
      9
    ],
    "verdict": "PUT",
    "count": 387
  },
  {
    "collection": [
      0,
      1,
      2,
      4,
      3,
      5,
      6,
      7,
      8,
      9
    ],
    "verdict": "PUT",
    "count": 392
  },
  {
    "collection": [
      9,
      8,
      7,
      6,
      5,
      4,
      3,
      1,
      2,
      0
    ],
    "verdict": "PUT",
    "count": 396
  },
  {
    "collection": [
      9,
      8,
      6,
      7,
      5,
      4,
      3,
      2,
      1,
      0
    ],
    "verdict": "PUT",
    "count": 398
  },
  {
    "collection": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      8,
      7,
      9
    ],
    "verdict": "PUT",
    "count": 399
  },
  {
    "collection": [
      9,
      7,
      8,
      6,
      5,
      4,
      3,
      2,
      1,
      0
    ],
    "verdict": "PUT",
    "count": 400
  },
  {
    "collection": [
      9,
      8,
      7,
      6,
      5,
      3,
      4,
      2,
      1,
      0
    ],
    "verdict": "PUT",
    "count": 400
  },
  {
    "collection": [
      0,
      1,
      3,
      2,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "verdict": "PUT",
    "count": 402
  },
  {
    "collection": [
      9,
      7,
      8,
      6,
      5,
      4,
      3,
      2,
      1,
      0
    ],
    "verdict": "CALL",
    "count": 404
  },
  {
    "collection": [
      0,
      1,
      2,
      4,
      3,
      5,
      6,
      7,
      8,
      9
    ],
    "verdict": "CALL",
    "count": 407
  },
  {
    "collection": [
      9,
      8,
      7,
      6,
      5,
      4,
      2,
      3,
      1,
      0
    ],
    "verdict": "CALL",
    "count": 411
  },
  {
    "collection": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      9,
      8
    ],
    "verdict": "CALL",
    "count": 552
  },
  {
    "collection": [
      9,
      8,
      7,
      6,
      5,
      4,
      3,
      2,
      0,
      1
    ],
    "verdict": "CALL",
    "count": 566
  },
  {
    "collection": [
      1,
      0,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "verdict": "CALL",
    "count": 567
  },
  {
    "collection": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      9,
      8
    ],
    "verdict": "PUT",
    "count": 568
  },
  {
    "collection": [
      8,
      9,
      7,
      6,
      5,
      4,
      3,
      2,
      1,
      0
    ],
    "verdict": "PUT",
    "count": 577
  },
  {
    "collection": [
      1,
      0,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "verdict": "PUT",
    "count": 595
  },
  {
    "collection": [
      9,
      8,
      7,
      6,
      5,
      4,
      3,
      2,
      0,
      1
    ],
    "verdict": "PUT",
    "count": 631
  },
  {
    "collection": [
      8,
      9,
      7,
      6,
      5,
      4,
      3,
      2,
      1,
      0
    ],
    "verdict": "CALL",
    "count": 635
  },
  {
    "collection": [
      9,
      8,
      7,
      6,
      5,
      4,
      3,
      2,
      1,
      0
    ],
    "verdict": "CALL",
    "count": 1126
  },
  {
    "collection": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "verdict": "CALL",
    "count": 1132
  },
  {
    "collection": [
      9,
      8,
      7,
      6,
      5,
      4,
      3,
      2,
      1,
      0
    ],
    "verdict": "PUT",
    "count": 1165
  },
];

module.exports = Prediction;
