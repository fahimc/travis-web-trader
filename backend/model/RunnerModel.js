const RunnerModel = {
  numberOfTicks:0,
  lossCollection:{},
  lossStreak:0,
  lossCount:0,
  winCount:0,
  transactionCollection:[],
  hasTransaction(){
    return this.transactionCollection.length;
  },
  runTransactions(price){
    this.transactionCollection.forEach((transaction,index)=>{
      transaction.run(price);
      if(transaction.ended) {
        this.transactionCollection.splice(index,1);
        if(transaction.isWin)
        {
          if(this.lossStreak)
          {
            if(!this.lossCollection[this.lossStreak])this.lossCollection[this.lossStreak]=0;
            this.lossCollection[this.lossStreak]++;
          }
          this.lossStreak=0;
          this.winCount++;
        }else{
          this.lossStreak++;
          this.lossCount++;
        }
      }
    });
  }
};

module.exports = RunnerModel;