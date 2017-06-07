const Main = {
  canvas: null,
  context: null,
  width: 500,
  height: 200,
  xIncrement: 10,
  collection: [],
  init() {
    document.addEventListener('DOMContentLoaded', this.onLoaded.bind(this));
  },
  onLoaded() {
    this.setNumbers();
    this.canvas = document.getElementById('stage');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext("2d");
    

    // let linear = this.findLineByLeastSquares(this.getXCollection(), this.collection);
    // let yCollection = linear[1];
    // let highLow = this.getHighLow(yCollection);
    // let change = Math.abs(yCollection[0]-yCollection[yCollection.length-1]);
    // let changePercentage = change/yCollection[0];
    // console.log('change',(changePercentage * 100 )+ '%');
    // this.drawLinearRegression(linear[0],linear[1]);
    // let changeCollection = this.calculateChangeBetweenTicks();
    // console.log(changeCollection);
    // this.calculateMean(changeCollection);
let ticks = [
  8831.73,
  8829.03,
  8828.81,
  8831.76,
  8832.10,
  8831.51,
  8833.51,
  8836.29,
  8836.74,
  8836.57,
  8835.60,
  8834.26,
  8833.80,
  8832.45,
  8830.45,
  8829.48,
  8829.68,
  8826.57,
  8829.21,
  8829.01,
  8827.37,
  8828.53,
  8827.07,
  8825.66,
  8827.12,
  8824.96,
  8826.02,
  8831.48,
  8831.76,
  8832.81,
  8831.20,
];
this.drawChart(ticks);
    let tradeChart = new TradeChart('stage2');
    tradeChart.setLinearRegression(true);
    tradeChart.renderChart(ticks);
    let changePercentage = tradeChart.getChangePercentage();
    console.log(changePercentage);
  },
  getHighLow(collection){
  	let lowest = collection[0];
  	let highest = collection[0];
  	collection.forEach((price)=>{
  		if(price < lowest)lowest = price;
  		if(price > highest)highest = price;
  	});
  	return {
  		lowest:lowest,
  		highest:highest
  	}
  },
  calculateChangeBetweenTicks(){
  	let c = [];
  	this.collection.forEach((price,index)=>{
  		if(index)c.push(Math.abs(price - this.collection[index-1]));
  	});
  	return c;
  },
  calculateMean(collection){
  	let sum = 0;
  	collection.forEach((change)=>{
  		sum+=change;
  	});
  	console.log(sum/collection.length);
  },
  getXCollection() {
    let xCollection = [];
    for (let a = 0; a < this.collection.length; a++) {
      xCollection.push(a * this.xIncrement);
    }
    return xCollection;
  },
  drawChart(ticks) {
    let x = 0;
    let y = this.height;
    let increment = 10;
    this.collection.forEach((num) => {
      let nextX = x + increment;
      this.drawLine(x, y, nextX, this.height-num);
      x = nextX;
      y = this.height-num;
    });

  },
  drawLinearRegression(xCollection,yCollection){
  	let x=0;
  	let y=0;

  	xCollection.forEach((num,index)=>{
  		if(!y)y=yCollection[0];
  		this.drawLine(x, y, num, this.height-yCollection[index],'blue');
  		x=num;
  		y=this.height-yCollection[index];
  	});
  },
  drawLine(moveX, moveY, lineX, lineY,color) {
    this.context.beginPath();
    this.context.moveTo(moveX, moveY);
    this.context.lineTo(lineX, lineY);
    this.context.strokeStyle=color?color:"black";
    this.context.stroke();
  },
  
  setNumbers() {
    for (let a = 0; a < 30; a++) {
      let negative = Math.floor(Math.random() * (10 - -100 + 1) + -100);
      this.collection.push(Math.round(Math.random() * 100) - negative);
    }
  }

}.init();
