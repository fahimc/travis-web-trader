var LowestPrediction = {
    prediction:'',
    predict(price, history, model) {
    if (model.transactionCollection.length >= 1 || history.length < 1000) {
      return;
    }
    let collection = history.slice(history.length-1000,history.length);
    let lowestPrice = this.getLowestPrice(collection);
    let highestPrice = this.getHighestPrice(collection);
    let currentPrice = history[history.length-1];
    let previousPrice = history[history.length-2]
    if(previousPrice <= lowestPrice &&  previousPrice <= currentPrice )this.prediction = { prediction:  'PUT', type: 'LOWEST_PRICE' };
    if(previousPrice >= highestPrice &&  previousPrice >= currentPrice)this.prediction = { prediction:  'CALL', type: 'LOWEST_PRICE' };
    return this.prediction;
  },
  getLowestPrice(history){
    let lowestPrice = Number(history[0]);
    history.forEach((price)=>{
      price = Number(price);
      if(price < lowestPrice)lowestPrice = price;
    });

    return lowestPrice;
  },
  getHighestPrice(history){
    let highestPrice = Number(history[0]);
    history.forEach((price)=>{
      price = Number(price);
      if(price > highestPrice)highestPrice = price;
    });

    return highestPrice;
  }
}
