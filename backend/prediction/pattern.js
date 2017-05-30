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
        let highest =[];
        let lowest = [];
         collection.forEach((price,index) => {
           highest.push({price:price,index:index});
           lowest.push({price:price,index:index});
        });
        highest.sort((a,b)=>{
            return a.price-b.price;
        });
         lowest.sort((a,b)=>{
            return a.price-b.price;
        });
         collection.forEach((price,index) => {
            if(price > collection[0])
            {
                highest.forEach((obj,i)=>{
                    if(obj.index == index)newCollection.push(i);
                });
            }
            if(price < collection[0])
            {
                lowest.forEach((obj,i)=>{
                    if(obj.index == index)newCollection.push(-i);
                });
            }
                
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
      -7,
      -8,
      -6,
      -5,
      -4,
      -3,
      -2,
      -1,
      0
    ],
    "verdict": "PUT",
    "count": 5
  },
  {
    "collection": [
      -8,
      -7,
      -5,
      -6,
      -4,
      -3,
      -2,
      -1,
      0
    ],
    "verdict": "CALL",
    "count": 5
  },
  {
    "collection": [
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
    "count": 5
  },
  {
    "collection": [
      -8,
      -7,
      -6,
      -5,
      -4,
      -2,
      -3,
      -1,
      0
    ],
    "verdict": "PUT",
    "count": 5
  },
  {
    "collection": [
      9,
      -7,
      -6,
      -5,
      -4,
      -3,
      -2,
      -1,
      0
    ],
    "verdict": "CALL",
    "count": 6
  },
  {
    "collection": [
      -8,
      -7,
      -6,
      -5,
      -4,
      -3,
      -2,
      0,
      -1
    ],
    "verdict": "CALL",
    "count": 6
  },
  {
    "collection": [
      9,
      -7,
      -6,
      -5,
      -4,
      -3,
      -2,
      -1,
      0
    ],
    "verdict": "PUT",
    "count": 7
  },
  {
    "collection": [
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
    "count": 7
  },
  {
    "collection": [
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
    "count": 10
  },
  {
    "collection": [
      -8,
      -7,
      -6,
      -5,
      -4,
      -3,
      -2,
      -1,
      0
    ],
    "verdict": "CALL",
    "count": 14
  },
  {
    "collection": [
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
    "count": 15
  },
  {
    "collection": [
      -8,
      -7,
      -6,
      -5,
      -4,
      -3,
      -2,
      -1,
      0
    ],
    "verdict": "PUT",
    "count": 21
  }
];

module.exports = Prediction;
