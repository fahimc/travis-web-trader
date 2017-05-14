const Util = {
    intervalDuration:1000,
    breakInterval:null,
    currentDuration:1000,
    getHighLow(collection) {
        let highest = collection[0];
        let lowest = collection[0];
        collection.forEach(function(price) {
            if (price < lowest) lowest = price;
            if (price > highest) highest = price;
        });
        return {
            highest: highest,
            lowest: lowest
        }
    },
    startBreakTimer(duration){
        this.currentDuration  = duration;
        clearInterval(this.breakInterval);
        this.breakInterval = setInterval(()=>{
             this.currentDuration -= this.intervalDuration;
            if(this.currentDuration == 0 ) {
                clearInterval(this.breakInterval);
            }
            View.updateTimer(this.currentDuration + ' seconds');
        },this.intervalDuration);
    }
};
