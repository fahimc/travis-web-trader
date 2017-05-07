class FakeWebSocket {
    constructor(url) {
        console.log('FakeWebSocket is RUNNING');
        this.onopen = null;
        this.onmessage = null;
        this.onclose = null;
        this.start();
    }
    start() {
        setTimeout(() => {
            if (this.onopen) this.onopen();
        }, 100);
    }
    send(str) {
        let data = JSON.parse(str);
        let key = Object.keys(data)[0];
        this.messageBack(key, data[key], data)
    }
    messageBack(key, data, all) {
        let obj = {};
        switch (key) {
            case 'balance':
                obj.balance = TestModel.getBalance();
                break;
            case 'asset_index':
                obj = TestModel.assets;
                break;
            case 'ticks_history':
                key = 'history';
                obj = TestModel.history;
                if (!TestModel.currentTick) TestModel.currentTick = TestModel.history[TestModel.history.length - 1];
                break;
            case 'ticks':
                this.startTicks();
                break;
            case 'proposal':
                obj.id = 12121212212121;
                obj.payout = all.amount + (all.amount * 0.94);
                TestModel.transactionType = all.contract_type;
                TestModel.currentStake = all.amount;
                TestModel.tickDuration = Number(all.duration);
                break;
            case 'buy':
                TestModel.isBuy = true;
                break;
        }

        this.message(key, obj);


    }
    message(key, obj) {
        let message = {
            msg_type: key
        };

        message[key] = obj;
        if (this.onmessage) this.onmessage({ data: JSON.stringify(message) });
    }
    startTicks() {
        setInterval(() => {
            let key = 'tick';

            let obj = {
                quote: TestModel.getTick(),
                epoch: new Date().getTime()
            }
            if (TestModel.isBuy && !TestModel.purchasedTick) {
                TestModel.purchasedTick = TestModel.currentTick;
                TestModel.balance -= TestModel.currentStake;
                this.message('balance', {
                    balance:  TestModel.balance 
                });
                this.message('transaction', {
                    action: 'buy'
                });
            } else if (TestModel.isBuy) {
                TestModel.transactionCount++;
                if (TestModel.transactionCount >= TestModel.tickDuration) {
                    this.message('transaction', {
                        action: 'sell',
                        amount: TestModel.getResult()
                    });
                    TestModel.transactionCount = 0;
                    TestModel.isBuy = 0;
                    TestModel.purchasedTick = 0;
                }
            }
            this.message(key, obj);

        }, TestModel.speed);
    }
};
if(TestModel.ENABLED){
  window.WebSocket = FakeWebSocket;
}
