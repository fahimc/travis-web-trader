var PatternPrediction = {
    predict(ticks, checkMode) {
        if (Main.isProposal) return;
        let found = false;
        let collection = ticks.slice(ticks.length-10,ticks.length);
        let normailisedCollection = this.normaliseTen(collection);
        found = this.findMatch(normailisedCollection,collection);
        
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
    findMatch(pattern,collection){
        let found = false;
        PATTERNS.forEach((obj)=>{
            if(pattern.toString() == obj.collection.toString()){
                let highLow = Util.getHighLow(collection);
                 ChartComponent.updatePredictionChart(collection, highLow.lowest, highLow.highest);
                Main.setPrediction(obj.verdict, 'PATTERN_'+obj.verdict+'_'+obj.count);
                found=true;
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
      4,
      3,
      5,
      6,
      7,
      8,
      9
    ],
    "verdict": "CALL",
    "count": 50
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
    "count": 65
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
    "verdict": "PUT",
    "count": 70
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
    "count": 86
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
    "count": 89
  }
];
