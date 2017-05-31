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
    "count": 635
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
    "verdict": "PUT",
    "count": 633
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
    "count": 577
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
    "count": 562
  },
   {
    "collection": [
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
    "count": 416
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
    "verdict": "CALL",
    "count": 416
  },
  {
    "collection": [
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
    "count": 413
  },
  {
    "collection": [
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
    "count": 368
  },
   {
    "collection": [
      9,
      8,
      -6,
      -5,
      -4,
      -3,
      -2,
      -1,
      0
    ],
    "verdict": "CALL",
    "count": 363
  },
  {
    "collection": [
      -8,
      -7,
      -6,
      -5,
      -4,
      -3,
      -1,
      0,
      -2
    ],
    "verdict": "PUT",
    "count": 357
  }
];

module.exports = Prediction;
