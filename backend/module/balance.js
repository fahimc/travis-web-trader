const Balance = {
    stake: {
        0: 0.50,
        1: 0.90,
        2: 1.90,
        3: 3.75,
        4: 7.70,
        5: 15.80,
        6: 32.60,
        7: 67.20,
        8: 138.70,
        9: 260.00,
        10: 500.00,
        11: 440.00,
        12: 750.00,
        13: 1000.00,
        14: 1000.00,
        15: 2000.00
    },
    paroliStake: 0,
    paroli(model) {
        if (!model.winStreak) {
            this.paroliStake = this.stake[model.paroliIndex];
        } else {
          //  this.paroliStake *= 2;
        }
        if (isNaN(this.paroliStake)) console.log('paroli is nan', this.paroliStake,model.paroliIndex);
        return this.paroliStake;
    },
    purchase(model) {
        let cost = 0;
        if (model.doParoli) {
            cost = this.stake[model.lossStreak - 2] ? this.stake[model.lossStreak - 2] : this.stake[model.lossStreak]
        } else {
            cost = this.stake[model.lossStreak] ? this.stake[model.lossStreak] : Math.abs(model.profit) * 2;
        }
        return cost;
    }
}

module.exports = Balance;
