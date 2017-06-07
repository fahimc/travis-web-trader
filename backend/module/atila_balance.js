const Balance = {
  stake: {},
  currentStake: 1,
  stakeCollection: [
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1
  ],
  nextCollection: [1,1,1,1,1,1,1,1,1],
  index: 0,
  setWin() {
    /*
    let obj = this.nextCollection[this.nextCollection.length - 1];
    if (obj !== undefined) {
      //obj = obj - 1;
    }
    for(let a=this.nextCollection.length-1;a>=0;--a){
        let obj = this.nextCollection[a];
        if(obj > this.currentStake)
        {
            this.nextCollection[a]-=1;
            break;
        }
    }
    
    let next = this.nextCollection[this.nextCollection.length-1]-1;
    if(next < 1)next = 1;
         //   console.log('before',this.nextCollection);
    for(let a=this.nextCollection.length-1;a>=0;--a){
        let lastIndex = this.nextCollection.length-1 ;
        if(a < lastIndex && this.nextCollection[a+1] < this.nextCollection[a]|| a ==0)
        {
            this.nextCollection[a] =1;
            break;
        }
    }
    */
    this.nextCollection.unshift(1);
    if (this.nextCollection.length > 9) this.nextCollection.pop();
    //console.log('after',this.nextCollection);
  },
  setLoss() {
    let nextStake = this.currentStake + 1;
    this.nextCollection.unshift(nextStake);
    if (this.nextCollection.length > 9) this.nextCollection.pop();
    //console.log(this.nextCollection);
  },
  restart() {

  },
  purchase(model) {
    this.index++;
    if (this.index > this.stakeCollection.length - 1) {
      this.currentStake = this.nextCollection[0];
      //if(this.currentStake>9)this.currentStake = 0;
      this.stakeCollection = this.nextCollection.slice();
      this.index = 0;
    }
    //console.log(this.stakeCollection);
    return this.stakeCollection[this.index];
  }
}

module.exports = Balance;
