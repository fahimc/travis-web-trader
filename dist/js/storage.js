const Storage = {
    keys: {
        startbalance: 'startbalance',
        balance: 'balance',
        wins: 'wins',
        loses: 'loses',
        hitLossLimit: 'hitLossLimit',
        lossArray: 'lossArray',
        streaks: 'streaks',
        historicalItemIndex: 'historicalItemIndex',
        historicalIndex: 'historicalIndex',
    },
    testPrefix: 'test_',
    streaks: {

    },
    wins: 0,
    loses: 0,
    lossArray: [],
    hitLossLimit: 0,
    init() {
        this.show();
        let str = this.get(this.keys.streaks);
        if (str && str != 'undefined') this.streaks = JSON.parse(str);

        str = this.get(this.keys.wins);
        if (str && str != 'undefined') this.wins = Number(str);

        str = this.get(this.keys.loses);
        if (str && str != 'undefined') this.loses = Number(str);

        str = this.get(this.keys.hitLossLimit);
        if (str && str != 'undefined') this.hitLossLimit = Number(str);

        str = this.get(this.keys.lossArray);
        if (str && str != 'undefined') this.lossArray = JSON.parse(str);

    },
    show() {
        let str = this.get(this.keys.streaks);
        let startbalance = this.get(Storage.keys.startbalance);
        let balance = this.get(Storage.keys.balance);
        let table = [];
        let wins = this.get(Storage.keys.wins);
        let loses = this.get(Storage.keys.loses);
        let hitLossLimit = this.get(Storage.keys.hitLossLimit);
        let lossArray = this.get(Storage.keys.lossArray);
        if (str && str != 'undefined') {
            console.table({ loses: JSON.parse(str) });
        }
        table.push({ name: 'starting balance', value: startbalance });
        table.push({ name: 'current balance', value: balance });
        if (startbalance && balance) {
            table.push({ name: 'current profit', value: (Number(balance) - Number(startbalance)).toFixed(2) });
        }
        table.push({ name: 'total wins', value: wins });
        table.push({ name: 'total loses', value: loses });
        table.push({ name: 'total lose limit hit', value: hitLossLimit });
        table.push({ name: 'loses array', value: lossArray });
        if (wins) {
            table.push({ name: 'total difference', value: Number(wins) - Number(loses) });
            let percentage = ((Number(wins) / (Number(wins) + Number(loses))) * 100).toFixed(2) + '%';
            table.push({ name: 'win percentage', value: percentage });
        }
        console.table(table);
    },
    get(key) {
        if (Tester.isTesting || TestModel.ENABLED) {
            key = this.testPrefix + key;
        }
        let content = localStorage.getItem(key);
        return content;
    },
    set(key, value) {
        if (Tester.isTesting || TestModel.ENABLED) {
            key = this.testPrefix + key;
        }
        localStorage.setItem(key, value);
    },
    setStreak(key) {
        if (this.streaks[key] == undefined) this.streaks[key] = 0;
        this.streaks[key]++;
        this.set(this.keys.streaks, JSON.stringify(this.streaks));
    },
    setLossArray(key){
        if(this.lossArray.length >= 5)this.lossArray.shift();
        this.lossArray.push(key);
        this.set(this.keys.lossArray,JSON.stringify(this.lossArray));
    },
    setWins(count, loses) {
        this.wins += count;
        this.loses += loses;
        this.set(this.keys.wins, this.wins);
        this.set(this.keys.loses, this.loses);
    },
    getLossArray(){
        return this.lossArray;
    },
    clearLossArray(){
        this.set(this.keys.lossArray, []);
    },
    setLossLimit() {
        this.hitLossLimit++;
        this.set(this.keys.hitLossLimit, this.hitLossLimit);
    },
    setBalance(balance) {
        this.set(this.keys.balance, balance);
    },
    setStartBalance(balance) {
        let b = this.get(this.keys.startbalance);
        if (b == undefined) this.set(this.keys.startbalance, balance);
    },
    getStreaks() {
        let str = this.get(this.keys.streaks);
        if (!str) return;
        let json = JSON.parse(str);
        return json;
    },
    clear() {
        localStorage.clear();
        location.reload();
    },
    clearTest() {
        Main.end(true);
        for (key in this.keys) {
            localStorage.setItem(this.testPrefix + key, undefined);
        }
    }
}
