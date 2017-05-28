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
        1,
        0,
        2,
        3,
        4,
        5,
        6,
        8,
        7,
        9
    ],
    "count": 8,
    "verdict": "CALL"
}, {
    "collection": [
        0,
        1,
        2,
        4,
        3,
        5,
        6,
        9,
        8,
        7
    ],
    "count": 8,
    "verdict": "PUT"
}, {
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
    "count": 8,
    "verdict": "PUT"
}, {
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
    "count": 8,
    "verdict": "CALL"
}, {
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
    "count": 8,
    "verdict": "CALL"
}, {
    "collection": [
        1,
        0,
        2,
        3,
        4,
        5,
        6,
        7,
        9,
        8
    ],
    "count": 12,
    "verdict": "CALL"
}, {
    "collection": [
        3,
        1,
        0,
        2,
        4,
        5,
        6,
        7,
        8,
        9
    ],
    "count": 12,
    "verdict": "PUT"
}, {
    "collection": [
        9,
        8,
        5,
        7,
        4,
        3,
        6,
        2,
        1,
        0
    ],
    "count": 12,
    "verdict": "PUT"
}, {
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
    "count": 12,
    "verdict": "PUT"
}, {
    "collection": [
        9,
        8,
        7,
        6,
        5,
        4,
        2,
        1,
        3,
        0
    ],
    "count": 12,
    "verdict": "PUT"
}, {
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
    "count": 12,
    "verdict": "CALL"
}, {
    "collection": [
        0,
        1,
        2,
        4,
        3,
        6,
        5,
        7,
        9,
        8
    ],
    "count": 12,
    "verdict": "PUT"
}, {
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
    "count": 12,
    "verdict": "PUT"
}, {
    "collection": [
        2,
        3,
        6,
        9,
        7,
        8,
        5,
        4,
        1,
        0
    ],
    "count": 12,
    "verdict": "CALL"
}, {
    "collection": [
        0,
        1,
        2,
        4,
        3,
        5,
        6,
        7,
        9,
        8
    ],
    "count": 14,
    "verdict": "PUT"
}, {
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
    "count": 18,
    "verdict": "CALL"
}, {
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
    "count": 20,
    "verdict": "PUT"
}, {
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
    "count": 20,
    "verdict": "CALL"
}, {
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
    "count": 20,
    "verdict": "PUT"
}, {
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
    "count": 20,
    "verdict": "CALL"
}, {
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
    "count": 22,
    "verdict": "CALL"
}, {
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
    "count": 24,
    "verdict": "CALL"
}];
