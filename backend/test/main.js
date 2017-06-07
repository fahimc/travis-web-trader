const Main = {
  canvas: null,
  context: null,
  width: 500,
  height: 200,
  xIncrement: 10,
  collection: [200],
  init() {
    document.addEventListener('DOMContentLoaded', this.onLoaded.bind(this));
  },
  onLoaded() {
    this.setNumbers();
    this.canvas = document.getElementById('stage');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext("2d");
    this.drawChart();

    let linear = this.findLineByLeastSquares(this.getXCollection(), this.collection);
    let yCollection = linear[1];
    let highLow = this.getHighLow(yCollection);
    let change = Math.abs(yCollection[0]-yCollection[yCollection.length-1]);
    console.log('change',change);
    console.log(change/yCollection[0]);
    this.drawLinearRegression(linear[0],linear[1]);

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
  getXCollection() {
    let xCollection = [];
    for (let a = 0; a < this.collection.length; a++) {
      xCollection.push(a * this.xIncrement);
    }
    return xCollection;
  },
  drawChart() {
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
  findLineByLeastSquares(values_x, values_y) {
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var count = 0;

    /*
     * We'll use those variables for faster read/write access.
     */
    var x = 0;
    var y = 0;
    var values_length = values_x.length;

    if (values_length != values_y.length) {
      throw new Error('The parameters values_x and values_y need to have same size!');
    }

    /*
     * Nothing to do.
     */
    if (values_length === 0) {
      return [
        [],
        []
      ];
    }

    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (var v = 0; v < values_length; v++) {
      x = values_x[v];
      y = values_y[v];
      sum_x += x;
      sum_y += y;
      sum_xx += x * x;
      sum_xy += x * y;
      count++;
    }

    /*
     * Calculate m and b for the formular:
     * y = x * m + b
     */
    var m = (count * sum_xy - sum_x * sum_y) / (count * sum_xx - sum_x * sum_x);
    var b = (sum_y / count) - (m * sum_x) / count;

    /*
     * We will make the x and y result line now
     */
    var result_values_x = [];
    var result_values_y = [];

    for (var v = 0; v < values_length; v++) {
      x = values_x[v];
      y = x * m + b;
      result_values_x.push(x);
      result_values_y.push(y);
    }

    return [result_values_x, result_values_y];
  },
  setNumbers() {
    for (let a = 0; a < 30; a++) {
      let negative = Math.floor(Math.random() * (10 - -100 + 1) + -100);
      this.collection.push(Math.round(Math.random() * 100) - negative);
    }
  }

}.init();
