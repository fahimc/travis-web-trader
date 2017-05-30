class Transaction {
  constructor(purchasePrice,pastCollection){
    this.pastCollection = pastCollection;
    this.tickCount=0;
    this.purchasePrice=purchasePrice;
    this.verdict = '';
    this.ended=false;
  }
  run(price){
    if(this.ended)return;
    this.tickCount++;
    if(this.tickCount >=6){
      this.verdict = this.purchasePrice > price ? 'PUT' : 'CALL';
      this.ended=true;
    }
  }
};

module.exports = Transaction;