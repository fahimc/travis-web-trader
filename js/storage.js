const Storage = {
	keys:{
		startbalance:'startbalance',
		balance:'balance',
		wins:'wins',
		loses:'loses',
		streaks:'streaks',
		historicalItemIndex:'historicalItemIndex',
		historicalIndex:'historicalIndex',
	},
	testPrefix:'test_',
	streaks:{

	},
	wins:0,
	loses:0,
	init(){
		let str = this.get(this.keys.streaks);
		let startbalance = this.get(Storage.keys.startbalance);
		let balance = this.get(Storage.keys.balance);
		if(str)console.log('loss streak',JSON.parse(str));
		console.log('start balance',startbalance);
		let wins = this.get(Storage.keys.wins)
		let loses = this.get(Storage.keys.loses)
		console.log('total wins',wins);
		console.log('total loses',loses);
		if(wins)
		{
			console.log('total win difference',Number(wins)- Number(loses));
			let percentage = ((Number(wins)/(Number(wins)+Number(loses))) * 100).toFixed(2) + '%';
			console.log('total win percentage',percentage);
		}
		if(startbalance && balance){
			console.log('current profit £', Number(balance)  - Number(startbalance) )
		}

		if(str)this.streaks = JSON.parse(str);

		str = this.get(this.keys.wins);
		if(str)this.wins = Number(str);

		str = this.get(this.keys.loses);
		if(str)this.loses = Number(str);
	},
	get(key){
		if(Tester.isTesting||TestModel.ENABLED) {
			key = this.testPrefix + key;
		}
		let content = localStorage.getItem(key);
		return content ;
	},
	set(key, value){
		if(Tester.isTesting||TestModel.ENABLED) {
			key = this.testPrefix + key;
		}
		console.log(key,value);
		localStorage.setItem(key,value);
	},
	setStreak(key){
		console.log('Storage loss streak',key);
		if(this.streaks[key] == undefined)this.streaks[key] = 0;
		this.streaks[key]++;
		this.set(this.keys.streaks,JSON.stringify(this.streaks));
	},
	setWins(count,loses){
		console.log('setWins');
		this.wins+=count;
		this.loses+=loses;
		this.set(this.keys.wins,this.wins);
		this.set(this.keys.loses,this.loses);
	},
	setBalance(balance){
		let b = this.get(this.keys.balance);
		if(b == undefined)this.set(this.keys.balance,balance);
	},
	setStartBalance(balance){
		let b = this.get(this.keys.startbalance);
		if(b == undefined)this.set(this.keys.startbalance,balance);
	},
	getStreaks(){
		let str = this.get(this.keys.streaks);
		if(!str) return;
		let json = JSON.parse(str);
		return json;
	},
	clear(){
		localStorage.clear();
		location.reload();
	},
	clearTest(){
		Main.end(true);
		for(key in this.keys){
			localStorage.setItem(this.testPrefix + key,undefined);
		}
	}
}