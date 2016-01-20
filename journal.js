 
module.exports = function(RED) {
    function Journal(config) {
	var Fifo = require('fifo-array');
	var storage = require('node-persist');
        RED.nodes.createNode(this,config);
		this.max = config.max;
		this.storeName = config.storeName;
		console.log("STORENAME: ", this.storeName)
		this.persist = config.persist;
		this.persistInterval  = config.persistInterval;
        var node = this;
		storage.initSync({
			interval: 1000 * this.persistInterval
		});
		fifo = storage.getItem(this.storeName);
		console.log("FIFO INIT: ", fifo);
        var fifo  = fifo || new Fifo(node.max, []);
		
		var cnt = 0;
        this.on('input', function(msg) {
			// Push the value on to the fifo and output the fifo as a message.
			var values = msg.payload;
            fifo.push(values);
	    	var newMsg = {payload: fifo }
            node.send([newMsg, null]);
			storage.setItem(this.storeName, fifo);
			// Output the average every 'n' samples n the second output.
			if(cnt == fifo.length-1) {
				cnt=0;
				var sum  = fifo.reduce(function(a, b) { return a + b; }, 0);
				var average  = sum /  fifo.length;
				node.send([null,{payload: average}])
			} else {
				cnt++;
			}
        });
    }
    RED.nodes.registerType("journal",Journal);
}
