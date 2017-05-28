var SevenStake = {
  stake:{
    0: 0.50,
    1: 0.90,
    2: 1.90,
    3: 3.75,
    4: 7.70,
    5: 15.80,
    6: 32.60,
    7: 67.20,
    8: 138.70,
    9: 160.00,
    10: 95.00,
    11: 440.00,
    12: 750.00,
    13: 1000.00,
    14: 1000.00,
    15: 2000.00
  },
  getStake(currentStake,lossCount) {
   // console.log('Seven Stake',this.stake[lossCount]);
    return this.stake[lossCount] != undefined ? this.stake[lossCount] : currentStake * 2;
  }
};


const StrategyTester = {
    balance: -7.05,
    balance2: 0,
    stake: 0.5,
    lossStreak: 3,
    lossArray:[
    203,
    97,
    50,
    24
    ],
    init() {
      this.run();
    },
    run() {
      this.test2();
    },
    test1(){
      let stake = (Math.abs(this.balance)/this.lossStreak);
      console.log('stake',stake);
      let winCount = 0;
      for(let a=0;a<this.lossStreak;a++){
        this.balance -= stake; 
        let isWin = this.getResult();
        if(isWin)
        {
          winCount++;
          this.balance += stake + (stake * 0.94);
        }
      }
      console.log('balance',this.balance);
      console.log('winCount',winCount);
    },
    test2(){
      this.lossArray.forEach((count,index)=>{
        for(let a=0;a<count;a++){
          for(let b=0;b<=index;b++)
          {
            this.balance2 -= this.getSevenStakeLossResult(b);
          // if(index==0)console.log('balance',this.balance2);
          }
          this.balance2 += this.getSevenStakeResult(index+1);
            //if(count==203)console.log('balance',this.balance2);
        }
      });
      for(let a=0;a<this.lossArray[3];a++){
        for(let b=0;b<4;b++)
          {
           this.balance2 -= this.getSevenStakeLossResult(b);
          }
          this.balance2 -= this.getSevenStakeLossResult(4);
        } 
     console.log('balance',this.balance2);
    },
    getSevenStakeResult(index){
      let stake = SevenStake.getStake(null,index);
        return (stake * 0.94);
    },
    getSevenStakeLossResult(index){
      let stake = SevenStake.getStake(null,index)
        return stake;
    },
    getResult(){
      return this.getRandomInt(0,1);
    },
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}.init();

