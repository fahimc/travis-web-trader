const RunnerModel = {
  STARTING_BALANCE:1100,
  balance:0,
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
          
          this.lossStreak=0;
          this.winCount++;
        }else{
          this.lossStreak++;
          if(this.lossStreak)
          {
            if(!this.lossCollection[this.lossStreak])this.lossCollection[this.lossStreak]=0;
            this.lossCollection[this.lossStreak]++;
          }
          this.lossCount++;
        }
      }
    });
  }
};

module.exports = RunnerModel;