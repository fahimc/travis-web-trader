const Model = {
    transactionCollection: [],
    createTransaction(proposal, predictionType, predictionPrice, ticks,duration,unit) {
        let transaction = new Transaction(proposal, predictionType, predictionPrice, ticks);
        if(Main.config.stakeType == 'KellyStake')Main.setStake();
        Main.setPrediction(transaction.prediction, transaction.predictionType,duration,unit);
        this.transactionCollection.push(transaction);
    },
    purchaseTransaction(transactionData) {
      //console.log(transactionData);
        let found = null;
        this.transactionCollection.forEach((transaction) => {
            if (!transaction.transaction && !found) {
                found = transaction;
                transaction.transaction = transactionData;
            }
        });
        if(found)ChartComponent.updatePredictionChart(found.ticks, found.boundary.lowest, found.boundary.highest);

    },
    purchasePrice(buy) {
   //   console.log(buy);
        let found = null;
        this.transactionCollection.forEach((transaction) => {
            if (!transaction.buyPrice && !found) {
                found = transaction;
               // transaction.buyPrice = transactionData;
                //console.log(transaction.predictionPrice,transactionData.);
            }
        });

    },
    completeTransaction(transactionData){
      for(let a=0;a<this.transactionCollection.length;a++){
        if(this.transactionCollection[a].transaction.id==transactionData.id)
        {
          this.transactionCollection.splice(a,1);
          break;
        }
      }
    }
};
