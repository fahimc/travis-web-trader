const Main = {
    isVirtual: true,
    isTarget: true,
    disableFahimgale: false,
    stakeTicks: 6,
    profitLimit: 100, //DEBUG
    lossLimit: -500,
    lossStreakLimit: 7,
    volatilityLimit: 5,
    stake: 0.5,
    currentStake: 0.5,
    chanelPrediction: false,
    bullishPrediction: true,
    trendPrediction: false,
    trendingUpPrediction: false,
    maxPrediction: false,
    trendUpDuration: 10,
    trendUpLongDuration: 300,
    trendingUpBarrier: 10,
    longBreakLossCount: 6,
    ws: null,
    history: [],
    winCount: 0,
    lossCount: 0,
    balance: 100,
    startBalance: 0,
    accountBalance: 0,
    payout: 0.94,
    lossStreak: 0,
    maxLossStreak: 0,
    started: false,
    currentTick: 0,
    currentContract: null,
    ended: false,
    startMartingale: false,
    currentPrice: 0,
    localWS: null,
    highestPrice: null,
    lowestPrice: null,
    lossLimitDefault: 0,
    prediction: '',
    ASSET_NAME: 'R_100',
    predictionItem: null,
    highestProfit: 0,
    lowestProfit: null,
    isProposal: false,
    historicHighest: 0,
    historicLowest: 0,
    trendLength: 4000,
    shortTrendLength: 20,
    historyTimes: [],
    startTime: null,
    predictionType: null,
    predictionModel: null,
    lossStreak: 0,
    shortLossStreak: 0,
    isShort: false,
    pauseTimer: null,
    isTrading: false,
    trendSuccess: [],
    trendFail: [],
    trendSucessPercentage: 0.6,
    pauseTrading: false,
    currentTrendItem: {},
    ticksAverageCollection: [],
    volatileTimer: null,
    volatilatyCap: 30,
    proposalTickCount: 0,
    lastBalance: 0,
    breakDuration: 120000, //LIVE
    longBreakDuration: 300000, //LIVE
    //breakDuration: 1000, //BULL
    //longBreakDuration: 10000, //BULL
    idleStartTime: 0,
    volatileChecker: true,
    martingaleStakeLevel: 8,
    transactionTimer: null,
    transactionTimerDuration: 30000,
    isTransaction: false,
    log: {

    },
    init() {
        document.addEventListener('DOMContentLoaded', this.onLoaded.bind(this));
        this.setDefaults();
    },
    setDefaults() {
        this.lossLimitDefault = this.lossLimit;
    },
    addListener() {
        App.EventBus.addEventListener(App.EVENT.START_TRADING, this.onStartTrading.bind(this));
        App.EventBus.addEventListener(App.EVENT.STOP_TRADING, this.onStopTrading.bind(this));
        App.EventBus.addEventListener(App.EVENT.PROPOSE_FALL, this.onProposeFall.bind(this));
        App.EventBus.addEventListener(App.EVENT.PROPOSE_RAISE, this.onProposeRaise.bind(this));

        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);


    },
    onLoaded() {
        this.checkQuery();
        this.setConfig();
        ChartComponent.create();
        View.init();
        View.updateStake(this.currentStake, this.lossLimit, this.profitLimit);

        Tester.start();
        if (!Tester.isTesting) {
            this.ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=' + (this.isVirtual? Config.virtual.appID: Config.live.appID));
            this.addListener();
        }
        Storage.init();

    },
    setConfig(){
        if(Config.isVirtual !== undefined)this.isVirtual = Config.isVirtual;
    },
    checkQuery() {
        let isTestMode = this.getQueryVariable('testing');
        let prediction = this.getQueryVariable('prediction');
        if(isTestMode)
        {
            if(prediction){
                this.resetPredictions();
                this.setPredictionType(prediction);
            }
            TestModel.ENABLED = true;
            console.log('TESTING ENABLED');
            window.WebSocket = FakeWebSocket;
        }
    },
    getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1]; }
        }
        return false;
    },
    setPredictionType(prediction){
        if(this[prediction + 'Prediction'] != undefined )
        {
            this[prediction + 'Prediction'] = true;
        }
        console.log(prediction + 'Prediction');
    },
    resetPredictions(){
        this.chanelPrediction= false;
        this.bullishPrediction= false;
        this.trendPrediction= false;
        this.trendingUpPrediction= false;
    },
    onClose(event) {
        this.ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=' + (this.isVirtual? Config.virtual.appID: Config.live.appID));
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
    },
    onOpen(event) {
        //USGOOG
        //frxEURGBP

        this.authorize();

    },
    authorize() {
        if (this.ws) this.ws.send(JSON.stringify({ "authorize": (this.isVirtual? Config.virtual.apiKey: Config.live.apiKey) }));
    },
    buyContract() {
        if (this.ws) this.ws.send(JSON.stringify({
            "buy": this.proposalID,
            "price": this.currentStake + 200
        }));
    },
    getAvailableAssets() {
        if (this.ws) this.ws.send(JSON.stringify({ asset_index: 1 }));
    },
    getBalance() {
        if (this.ws) this.ws.send(JSON.stringify({ balance: 1, subscribe: 1 }));
    },
    addFunds() {
        if (this.ws) this.ws.send(JSON.stringify({ topup_virtual: '100' }));
    },
    getDateTimeString() {
        var currentdate = new Date();
        return currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    },
    reset() {
        this.lossLimit = this.lossLimitDefault;
        this.highestProfit = 0;
        this.lowestProfit = 0;
        this.lossCount = 0;
        this.lossStreak = 0;
        this.isShorter = false;
        this.shortLossStreak = 0;
        this.startMartingale = false;
        this.winCount = 0;
        this.currentStake = this.stake;
        this.prediction = '';
        this.startBalance = this.accountBalance;
        this.profit = 0;
        View.updateMartingale(this.startMartingale);
        View.updatePrediction('');
        View.updateCounts(this.winCount, this.lossCount);
        View.updateProfit(this.lowestProfit, this.highestProfit);
        View.updateBalance(this.accountBalance, this.profit);
        View.updatePredictionType('');
        View.ended(false);
    },
    end(ignoreReload) {
        if(this.ended)return;
        this.ended = true;
        clearTimeout(this.volatileTimer);
        View.ended(true);
        console.log('end called',this.winCount, this.lossCount);
        Storage.setWins(this.winCount, this.lossCount);
        Storage.setBalance(this.accountBalance);
        Tester.storeBalance();
        TestModel.end();
        if(this.isTarget)
        {
            let startBalance = Storage.get('startbalance');
            if(startBalance != undefined) {
                startBalance = Number(startBalance );
                if(this.accountBalance - startBalance >= this.profitLimit)ignoreReload = true;
            } 
        }

        this.ws.send(JSON.stringify({
            "forget_all": "ticks"
        }));
        this.ws.send(JSON.stringify({
            "forget_all": "balance"
        }));
        this.ws.send(JSON.stringify({
            "forget_all": "transaction"
        }));
        this.ws = null;
        if (!ignoreReload)setTimeout(()=>{
           location.reload();  
       },10);


    },
    getTranscations() {
        this.ws.send(JSON.stringify({
            "transaction": 1,
            "subscribe": 1
        }));

    },
    getHistory(count) {
        this.ws.send(JSON.stringify({
            "ticks_history": this.ASSET_NAME,
            "end": "latest",
            "count": count ? count : 5000
        }));
    },
    onStopTrading() {
        this.isTrading = false;
        this.end();
    },
    onStartTrading() {
        if (!this.startTime) {
            this.startTime = this.getDateTimeString();
            this.reset();
        }
        this.idleStartTime = new Date().getTime();
        this.isTrading = true;

    },
    onProposeRaise() {
        this.setPrediction('CALL', 'MANUAL_CALL');
        this.currentTrendItem = {
            predictionType: 'MANUAL_CALL',
            type: 'CALL'
        };
    },
    onProposeFall() {
        this.setPrediction('PUT', 'MANUAL_FALL');
        this.currentTrendItem = {
            predictionType: 'MANUAL_FALL',
            type: 'PUT'
        };
    },
    getPriceProposal(type, duration) {
        if (!type || this.isProposal) return;
        this.isProposal = true;
        this.proposalTickCount = 0;
        this.lastBalance = this.accountBalance;
        View.updatePrediction(type, this.startPricePosition, this.currentPrice);
        this.ws.send(JSON.stringify({
            "proposal": 1,
            "amount": this.currentStake,
            "basis": "stake",
            "contract_type": type ? type : "CALL",
            "currency": this.isVirtual ? "USD" : 'GBP',
            "duration": duration ? duration : String(this.stakeTicks),
            "duration_unit": "t",
            "symbol": this.ASSET_NAME
        }));
    },
    getParameterByName(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    getTicks() {
        this.ws.send(JSON.stringify({ ticks: this.ASSET_NAME }));
    },
    onMessage(event) {
        if (this.ended) return;
        var data = JSON.parse(event.data);
        //if (data.msg_type != 'tick') console.log('onMessage', data);
        switch (data.msg_type) {
            case 'authorize':
                //this.addFunds();
                if (!this.startTime) {
                    this.getBalance();
                } else {
                    this.getBalance();
                    this.getTicks();
                    this.getTranscations();
                }
                break;
            case 'topup_virtual':
                this.getBalance();
                break;
            case 'balance':
                if (!this.startBalance) {
                    this.startBalance = data.balance.balance;
                    Storage.setStartBalance(this.startBalance);
                }
                //if transaction fails this will ensure we still set the correct profit
                if (this.accountBalance != Number(data.balance.balance)) {
                    this.balanceChanged(Number(data.balance.balance) - this.accountBalance);
                }
                this.accountBalance = data.balance.balance;
                this.setDefaultStake();
                this.lossLimit = -(this.accountBalance - 10); //dynamic lose limit
                this.setLossLimit();
                if (!this.started) this.getAvailableAssets();

                break;
            case 'asset_index':
                this.assetArray = data.asset_index;
                View.updateAsset(this.ASSET_NAME, this.assetArray, this.payout);
                this.getTicks();
                this.getTranscations();
                View.activeButton();
                this.getHistory();
                break;
            case 'history':
                // console.log('history', data);
                if (!this.started) {
                    this.history = data.history.prices;
                    this.historyTimes = data.history.times;
                    this.started = true;
                    let collection = this.history.slice(this.history.length - 200, this.history.length);
                    let collection30 = this.history.slice(this.history.length - 30, this.history.length);
                    ChartComponent.setData(collection);
                    ChartComponent.setCloseData(collection30);
                    this.onStartTrading();
                }
                break;
            case 'proposal':
                // console.log('proposal', data);
                if (!data.proposal) return;
                this.proposalID = data.proposal.id;
                this.payout = data.proposal.payout;
                View.updateAsset(this.ASSET_NAME, this.assetArray, this.payout);
                this.buyContract();
                break;
            case 'buy':
                console.log('buy', data);
                break;
            case 'transaction':
                if (data.transaction && data.transaction.action && data.transaction.action == 'sell') {
                    //stop transaction timer
                    this.isTransaction = false;
                    clearTimeout(this.transactionTimer);
                    let isLoss = false;
                    if (data.transaction.amount === '0.00') {
                        isLoss = true;
                    }
                    this.doTransaction(isLoss);

                } else if (data.transaction && data.transaction.action && data.transaction.action == 'buy') {
                    this.isTransaction = true;
                }
                break;
            case 'forget_all':
                console.log('forget_all', data);
                break;
            case 'tick':
                if (data.tick) {
                    this.currentTick++;
                    this.history.push(data.tick.quote);
                    this.historyTimes.push(data.tick.epoch);
                    //console.log('ticks update',this.history.length);
                    this.currentPrice = data.tick.quote;
                    this.setPositions();

                    if (this.isTrading) {
                        this.doPrediction();
                    }
                    let collection = this.history.slice(this.history.length - 200, this.history.length);
                    let collectionClose = this.history.slice(this.history.length - 30, this.history.length);

                    let highLow = Util.getHighLow(collection);
                    let highLowClose = Util.getHighLow(collectionClose);

                    ChartComponent.update({
                        collection: collection,
                        price: this.currentPrice,
                        time: Date.now(),
                        lowestPrice: highLow.lowest,
                        highestPrice: highLow.highest
                    });
                    ChartComponent.updateClose({
                        collection: collectionClose,
                        price: this.currentPrice,
                        time: Date.now(),
                        lowestPrice: highLowClose.lowest,
                        highestPrice: highLowClose.highest
                    });
                    //this.proposalCompleteCheck();
                    Volatility.check(this.currentPrice);
                    if (this.idleStartTime) this.checkIdleTime();
                }
                break;
        }

    },
    balanceChanged(change) {
        clearTimeout(this.transactionTimer);
        this.transactionTimer = setTimeout(function() {
            clearTimeout(this.transactionTimer);
            if (this.isTransaction) {
                this.isTransaction = false;
                let isLoss = change < 0 ? true : false;
                console.log('balanceChanged triggered. is loss', isLoss);
                this.doTransaction(isLoss);
                clearTimeout(this.transactionTimer);
            }
        }.bind(this), this.transactionTimerDuration);
    },
    doPrediction() {
        if (this.trendPrediction) {
            TrendPrediction.predict(this.history);
        }
        if (this.chanelPrediction) {
            ChannelPrediction.predict(this.history);
        }
        if (this.bullishPrediction) {
            BullishPrediction.predict(this.history);
        }
        if (this.maxPrediction) {
            MaxPrediction.predict(this.history);
        }

    },
    setDefaultStake() {
        let balance = this.accountBalance;
        let amount = balance;
        for (let a = 0; a < 9; a++) {
            amount = (amount - (amount * 0.06)) / 2;
        }
        //this.stake = amount < 0.35 ? 1 : amount; //debug
        //this.profitLimit = this.stake * 0.8; //debug
        View.updateStake(this.currentStake, this.lossLimit, this.profitLimit);
    },
    checkIdleTime() {
        let time = new Date().getTime();
        let dif = time - this.idleStartTime;
        if (dif >= 300000) location.reload();
    },
    proposalCompleteCheck() {
        if (this.isProposal) {
            if (this.proposalTickCount > this.stakeTicks + 5) {
                console.log('proposalCompleteCheck');
                this.doTransaction();
            } else {
                this.proposalTickCount++;
            }
        }
    },
    doTransaction(isLoss) {
        this.isProposal = false;
        this.proposalTickCount = 0;
        this.idleStartTime = null;
        if (isLoss == undefined) {
            isLoss = this.lastBalance < this.accountBalance;
            //console.log(isLoss);
        }
        let profit = this.accountBalance - this.startBalance;
        if (isLoss == true) {
            //this.profit -= this.currentStake;
            this.lossStreak++;
            if(this.lossStreak >= this.volatilityLimit ) Volatility.changeLimit = Volatility.defaultChangeTightLimit;
            Storage.setStreak(this.lossStreak);
            this.startMartingale = true;
            this.lossCount++;
            if (this.isShort) this.shortLossStreak++;
            this.setFail();
        } else if (isLoss == false) {
            //this.profit += (this.currentStake + (this.currentStake * 0.94));
            this.lossStreak = 0;
             Volatility.changeLimit = Volatility.defaultChangeLimit;
            this.startMartingale = false;
            this.winCount++;
            this.setSuccess();
        }

        if (this.lossStreak >= 4) {
            let isGreaterThanFive = this.lossStreak > this.longBreakLossCount;
            this.takeABreak(isGreaterThanFive);
        }
        View.updateMartingale(this.startMartingale);
        this.prediction = '';
        this.predictionItem = null;
        View.updatePrediction('');
        ChartComponent.updatePredictionChart([]);
        this.setStake(isLoss);
        View.updateCounts(this.winCount, this.lossCount, this.maxLossStreak);
        if (this.isTarget && this.lossStreak >= this.lossStreakLimit || profit <= this.lossLimit || this.accountBalance <= 0 || profit >= this.profitLimit) {
            let ignore = this.isTarget ? profit >= this.profitLimit : profit <= this.lossLimit;
            this.end(ignore);
        }
        if (!isLoss) this.end();

    },
    takeABreak(isLong) {
        this.isTrading = false;
        View.setBreak(true);
        setTimeout(function() {
            this.isTrading = true;
            View.setBreak(false);
            let count = this.lossStreak - this.longBreakLossCount;
        }.bind(this), isLong ? this.longBreakDuration + (count * 60000) : this.breakDuration);
    },
    setLossLimit() {
        let profit = this.accountBalance - this.startBalance;
        this.profit = profit;
        if (profit > this.highestProfit) this.highestProfit = profit;
        if (this.lowestProfit == null || profit < this.lowestProfit) this.lowestProfit = profit;
        if (profit / 30 > 0.95) {
            //this.lossLimit = 29;
        } else if (profit / 20 >= 0.95) {
            //this.lossLimit = 19;
        } else if (profit > 0 && this.highestProfit >= 10) {
            // this.lossLimit = 1;
        } else if (profit < -10 && this.highestProfit < 5 && (this.lossCount + this.winCount) > 30) {
            //this.profitLimit = 1;
        }
        View.updateProfit(this.lowestProfit, this.highestProfit);
        View.updateBalance(this.accountBalance, profit);
        if (Tester && Tester.testBalance) Tester.setBalance(this.accountBalance - this.startBalance);
    },
    setStake(isLoss) {
        if(isLoss && Config.stakeType && window[Config.stakeType]) {
            this.currentStake = window[Config.stakeType].getStake(this.currentStake,this.lossCount);
        }else if (isLoss && this.startMartingale) {
            let profit = Math.abs(this.profit);
            if (!this.disableFahimgale) {
                // this.currentStake = Math.ceil(Math.abs(this.profit) + (Math.abs(this.profit) * 0.06));//debug martingale remvoed to test
                let cut = this.lossStreak > 3 ? 0.00 : 0.4;
                if (this.lossStreak > 3) cut = 0.0;
                let profitAbs = Math.abs(this.profit);
                let newStake = (profitAbs * 0.5) + ((profitAbs * 0.5) * cut);
                let _stake = Number((newStake * 2).toFixed(2));
                this.currentStake = _stake;
            } else {
                //non fahimgale
            }

        } else {
            this.currentStake = this.stake;
        }
        if (this.profit - this.currentStake <= this.lossLimit) this.end(true);
        View.updateStake(this.currentStake, this.lossLimit, this.profitLimit);
    },
    setPositions() {
        let highestPrice = 0;
        let lowestPrice = 0;

        this.history.forEach(function(price) {
            if (price < lowestPrice || !lowestPrice) lowestPrice = price;
            if (price > highestPrice) highestPrice = price;
        }.bind(this));

        this.historicHighest = highestPrice;
        this.historicLowest = lowestPrice;

        this.lowestPrice = lowestPrice < this.lowestPrice ? lowestPrice : this.lowestPrice;
        this.highestPrice = highestPrice > this.highestPrice ? highestPrice : this.highestPrice;

        View.updateHighLow(this.lowestPrice, this.highestPrice, this.currentPrice);
        this.startPricePosition = (this.currentPrice / this.highestPrice).toFixed(4);
        this.lastTicks = this.history.slice(this.history.length - 11, this.history.length);
        View.updateStartPosition(this.startPricePosition);
    },
    setFail() {
        let obj = Object.assign({}, this.currentTrendItem);
        this.trendFail.push(obj);

        let logItem = this.getLogItem(this.currentTrendItem.predictionType);
        logItem.loses++;
        if (this.lossStreak > this.maxLossStreak) this.maxLossStreak = this.lossStreak;
        View.updateLog(this.log);
    },
    setSuccess() {
        let obj = Object.assign({}, this.currentTrendItem);
        this.trendSuccess.push(obj);
        let logItem = this.getLogItem(this.currentTrendItem.predictionType);
        logItem.wins++;
        View.updateLog(this.log);
    },
    getLogItem(type) {
        if (!type) type = '';
        type = type.replace(':', '_');
        if (!this.log[type]) {
            this.log[type] = {
                wins: 0,
                loses: 0,
            }
        }
        return this.log[type];
    },
    setPrediction(proposal, predictionType, duration) {
        this.getPriceProposal(proposal, duration);
        View.updatePredictionType(predictionType);
        this.predictionType = predictionType;
    }
}
Main.init();
