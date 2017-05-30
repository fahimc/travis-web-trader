const Websocket = require('ws');
const fs = require('fs');
const path = require('path');
let CONFIG = {};
const GetHistory = {
    STARTING_EPOC: '',
    NUMBEROFDAYS: 7,
    epochOneDayDiff: 349980,
    epochDifference: 349980,
    startDate: null,
    startEpoch: null,
    historyCollection:[],
    ws: null,
    init() {
        this.epochDifference = this.epochOneDayDiff * this.NUMBEROFDAYS;
        let content = fs.readFileSync(path.resolve('../dist/config.js'), "utf8");
        content = content.replace('const Config = ', 'this.Config = ');
        eval(content)
        this.connect();
    },
    connect() {
        this.ws = new Websocket('wss://ws.binaryws.com/websockets/v3?app_id=' + this.Config.virtual.appID);
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
    },
    onClose() {},
    onOpen() {
        this.authorize();
    },
    authorize() {
        this.send('authorize', this.Config.virtual.apiKey);
    },
    onMessage(message) {
        let data = JSON.parse(message.data);
        //onsole.log(data);
        switch (data.msg_type) {
            case 'authorize':
                this.getNext(this.getTodaysEpoch());
                break;
            case 'history':
                this.historyCollection = this.historyCollection.concat(data.history.prices);
                let lastEpoch = data.history.times[0];
                let lastDate = this.epochToDate(lastEpoch);
                let diff = this.startEpoch - lastEpoch;
                console.log('diff',diff,'need to reach ',this.epochDifference);
                if (diff < this.epochDifference) {
                    setTimeout(() => {
                        this.getNext(lastEpoch);
                    }, 100);
                } else {
                    console.log('complete');
                    this.write(this.historyCollection);
                }
                break;
        }
    },
    write(collection) {
        fs.writeFile('historyData.json', JSON.stringify(this.historyCollection, null, 2), 'utf8', null);
        console.log('saved');
    },
    getNext(epoch) {
        this.ws.send(JSON.stringify({
            "ticks_history": 'R_100',
            "end": epoch,
            "count": 5000
        }));
    },
    daydiff(first, second) {
        return Math.round((second - first) / (1000 * 60 * 60 * 24));
    },
    getTodaysEpoch() {
        this.startDate = new Date();
        this.startEpoch = Math.round(this.startDate.getTime() / 1000.0);
        return this.startEpoch;
    },
    epochToDate(epoch) {
        var d = new Date(0);
        d.setUTCSeconds(epoch);
        return d;
    },
    send(key, value) {
        let obj = {};
        obj[key] = value;
        this.ws.send(JSON.stringify(obj));
    },
}.init();
