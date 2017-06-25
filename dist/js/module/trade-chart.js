class TradeChart {
    constructor(canvasID) {
        this.canvas = document.querySelector('#' + canvasID);
        this.context = this.canvas.getContext("2d");
        this.strokeColor = 'rgba(75,192,192,0.4)';
        this.strokeWidth = '2';
        this.showLinearRegression = false;
        this.chartCollection = [];
        this.linearCollection = [];
        this.purchasePrice = 0;
        this.purchaseType = '';

        window.addEventListener('resize', this.resize.bind(this));
        setTimeout(() => {
            this.resize();
        }, 1000);
    }
    resize() {
        this.height = this.canvas.parentElement.getBoundingClientRect().height;
        this.height = this.canvas.height = 220;
        this.width = this.canvas.parentElement.getBoundingClientRect().width - 40;
        this.canvas.width = this.width;
    }
    getHighestLowest(collection) {
        let lowest = Number(collection[0]);
        let highest = Number(collection[0]);
        collection.forEach((price) => {
            price = Number(price);
            if (price < lowest) lowest = price;
            if (price > highest) highest = price;
        });
        return {
            highest: highest,
            lowest: lowest
        };
    }
    setStrokeColor(value) {
        this.strokeColor = value;
    }
    setLinearRegression(value) {
        this.showLinearRegression = value;
    }
    getChangePercentage() {
        if (!this.linearCollection.length) return;
        let highLow = this.getHighestLowest(this.linearCollection);
        let change = Math.abs((highLow.highest - highLow.lowest) - (highLow.highest - highLow.lowest));
        let changePercentage = (change) * (highLow.highest - highLow.lowest);
        //console.log(change, changePercentage);
        return changePercentage;
    }
    setPurchase(value, type) {
        if (!value || !this.purchasePrice) {
            this.purchasePrice = Number(value);
            this.purchaseType = type;
        }
    }
    getLinearChange() {
        if (!this.linearCollection.length) return;
        let highLow = this.getHighestLowest(this.chartCollection);
        let last = Number(this.linearCollection[this.linearCollection.length - 1]);
        let per = (last - highLow.lowest) / (highLow.highest - highLow.lowest);
        let change = Math.abs(per - 0.5);
        return change;
    }
    getLinearFirstChange() {
        if (!this.linearCollection.length) return;
        let highLow = this.getHighestLowest(this.chartCollection);
        let first = Number(this.linearCollection[0]);
        let fper = (first - highLow.lowest) / (highLow.highest - highLow.lowest);
        let firstChange = Math.abs(fper - 0.5);
        return firstChange;
    }
    getLinearDirection() {
        return this.linearCollection[this.linearCollection.length - 1] - this.linearCollection[0];
    }
    getIndexedCollection(collection, highestCollection) {
        let highLow = this.getHighestLowest(highestCollection ? highestCollection : collection);
        let arr = [];
        // collection.forEach((num, index) => {
        //     console.log(num, highLow.highest, num / highLow.highest);
        //     arr.push(num / highLow.highest);
        // });
        collection.forEach((num, index) => {
            // console.log(num, highLow.highest, num / highLow.highest);
            arr.push({ num: num, xIndex: index });
        });
        arr.sort((obj, obj2) => {
            return obj.num - obj2.num;
        });
        arr.forEach((obj, index) => {
            // console.log(num, highLow.highest, num / highLow.highest);
            arr[index].yIndex = index;
        });
        arr.sort((obj, obj2) => {
            return obj.xIndex - obj2.xIndex;
        });
        return arr;
    }
    getPercentageCollection(collection, highestCollection) {
        let highLow = this.getHighestLowest(highestCollection ? highestCollection : collection);
        let arr = [];
        collection.forEach((num, index) => {
            num = Number(num);
            arr.push((num - highLow.lowest) / (highLow.highest - highLow.lowest));
        });

        return arr;
    }
    renderLinearRegression() {
        let linear = this.findLineByLeastSquares(this.getXCollection(), this.chartCollection);
        this.linearCollection = linear[1];
        this.renderPercentage(this.linearCollection, this.chartCollection, '#999');
    }
    renderChart(_collection) {
        this.chartCollection = _collection;
        this.clear();
        //this.drawGrid();
        if (this.purchasePrice) {
            let y = this.renderPurchase();
            this.renderPurchaseType(y);
        }
        this.renderPercentage(_collection);
        if (this.showLinearRegression) this.renderLinearRegression();

    }
    renderPurchaseType(y) {
        this.context.fillStyle = "rgba(255,0,0,0.1)";
        let startY = this.purchaseType == 'CALL' ? y : 0;
        let endY = this.purchaseType == 'CALL' ? this.height : y;
        this.context.fillRect(0, startY, this.width, endY);
    }
    renderPurchase() {
        let highLow = this.getHighestLowest(this.chartCollection);
        let y = (this.purchasePrice - highLow.lowest) / (highLow.highest - highLow.lowest);
        //console.log(this.purchasePrice,highLow.highest,y);
        y = this.height - (y * this.height);
        this.drawLine(0, y, this.width, y, 'rgb(255,165,0)', true);
        return y;
    }
    render(_collection, highestCollection, color) {
        let collection = this.getIndexedCollection(_collection, highestCollection);
        let xIncrement = (this.width / collection.length);
        let yIncrement = (this.height / this.chartCollection.length);
        let x = 0;
        let y = this.height;

        collection.forEach((obj, index) => {
            let nextY = this.height - (obj.yIndex * yIncrement);
            let nextX = (obj.xIndex) * xIncrement;
            if (!index) y = nextY;
            this.drawLine(x, y, nextX, nextY, color ? color : this.strokeColor);
            x = nextX;
            y = nextY;
        });
    }
    renderPercentage(_collection, highestCollection, color, indexed) {
        let collection = this.getPercentageCollection(_collection, highestCollection);
        let xIncrement = (this.width / collection.length);
        let yIncrement = (this.height / this.chartCollection.length);
        let x = 0;
        let y = this.height;

        collection.forEach((num, index) => {
            num = Number(num);
            let nextY = this.height - (this.height * num);
            let nextX = index * xIncrement;
            if (!index) y = nextY;
            this.drawLine(x, y, nextX, nextY, color ? color : this.strokeColor);
            x = nextX;
            y = nextY;
        });
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    drawGrid(xCount, yCount) {
        let x = 0;
        let y = 0;
        let xIncrement = (this.width / this.chartCollection.length);
        // console.log(this.width,xIncrement,this.chartCollection.length);
        let yIncrement = (this.height / this.chartCollection.length);
        this.chartCollection.forEach((num, index) => {
            let nextX = x + xIncrement;
            let nextY = y + yIncrement;
            this.drawLine(0, nextY, this.width, nextY, 'rgba(224, 224, 224,0.05)');
            this.drawLine(nextX, 0, nextX, this.height, 'rgba(224, 224, 224,0.05)');
            x = nextX;
            y = nextY;
        });
    }
    drawLine(moveX, moveY, lineX, lineY, color, dotted) {
        this.context.beginPath();
        let dashes = [];
        if (dotted) dashes = [2, 2]
        this.context.setLineDash(dashes);
        this.context.moveTo(moveX, moveY);
        this.context.lineTo(lineX, lineY);
        this.context.strokeStyle = color ? color : "black";
        this.context.lineWidth = this.strokeWidth;
        this.context.stroke();
    }
    getXCollection() {
        let xCollection = [];
        let xIncrement = (this.width / this.chartCollection.length);
        for (let a = 0; a < this.chartCollection.length; a++) {
            xCollection.push(a * xIncrement);
        }
        return xCollection;
    }
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
            x = Number(values_x[v]);
            y = Number(values_y[v]);
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
            x = Number(values_x[v]);
            y = x * m + b;
            result_values_x.push(x);
            result_values_y.push(y);
        }

        return [result_values_x, result_values_y];
    }
};
