 
module.exports = function(RED) {
	function averageValues(that, values, keys) {
		console.log("AVV: ", that.topicSuffix, values[0], keys, that.avgCount)
		if(that.avgCount == that.max-1) {
			that.avgCount=0;
			ret = that.lastMsg;
			//Are we storing objects or simple values?
			if(keys) {
				for(k in keys) {
					for(var v=0; v<values.length; v++) {
						//console.log("AV: ", keys[k], that.averages[keys[k]], values[v])
						that.averages[keys[k]] += values[v][keys[k]];
					}
					//console.log("Averaging ", that.averages, keys[k]);
					ret.payload[keys[k]] = (that.averages[keys[k]] / values.length).toFixed(2);
					that.averages[keys[k]] = 0;
				}
				//console.log("SENDING: ", ret)
				that.send([null, ret])
			} else {
				var sum  = values.reduce(function(a, b) {
					return a + b.value}, 0);
				var average  = (sum /  values.length).toFixed(2);
				console.log("SENDING: ", average)
				that.send([null, {payload: average, topic: that.lastMsg.topic}])
			}
		} else {
			that.avgCount++;
		}
	}
    function Journal(config) {
	var Fifo = require('fifo-array');
	var storage = require('node-persist');
        RED.nodes.createNode(this,config);
		this.max = config.max;
		this.name = config.name;
		this.storeName = config.storeName;
		this.persist = config.persist;
		this.persistInterval  = config.persistInterval;
		this.clocked = config.clocked;
		console.log("Clocked: ", this.clocked)
		this.clockInterval = config.clockInterval;
		this.keysToAverage = config.keysToAverage ? config.keysToAverage.split(",") : null;
		this.topicSuffix = config.topicSuffix;
		this.lastMsg = {payload: null};
		this.avgCount = 0;
		if(this.keysToAverage) {
			this.averages = {}
			for(k in this.keysToAverage) {
				this.averages[this.keysToAverage[k]] = 0;
			}
		} else {
			this.averages = 0;
		}
		console.log("AVERAGES: ", this.averages)
        var node = this;
		storage.initSync({
			interval: 1000 * this.persistInterval
		});
		//Set up the clocked journalling if applicable
		if(this.clocked) {
			function journalClock(){
				console.log("Clock!!!: ", new Date())
				if(this.lastMsg) {
					fifo.push(this.lastMsg.payload);
				}
				node.send([{payload: fifo, topic: this.lastMsg.topic + this.topicSuffix}, null]);
				node.send([{payload: "Boo!"}])
				storage.setItem(this.storeName, fifo);
				that = this;
				averageValues(that, fifo, this.keysToAverage);
			}
			setInterval(journalClock.bind(this), this.clockInterval * 1000);
		}
		// Initialise the fifo with values from the persisted one.
        var fifo  = new Fifo(parseInt(node.max));
		//fifo.journalName = this.name;
		var oldFifo = storage.getItem(this.storeName);
		if(oldFifo) {
			oldFifo.map(function(obj){
				fifo.push(obj);
			})	
		}
		var cnt = 0;
        this.on('input', function(msg) {
			this.lastMsg = msg;
			// If clocked, just store the last value.
			if(!this.clocked) {
				// Push the value on to the fifo
	            fifo.push(msg.payload);
				//output the fifo as a message.
				node.send([{payload: fifo, topic: msg.topic + this.topicSuffix}, null]);
				storage.setItem(this.storeName, fifo);
				averageValues(this, fifo, this.keysToAverage);
			}

        });
    }
    RED.nodes.registerType("journal",Journal);
}
