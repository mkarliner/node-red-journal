 
module.exports = function(RED) {
    function Journal(config) {
	var Fifo = require('fifo-array');
        RED.nodes.createNode(this,config);
		this.max = config.max;
        var node = this;
        var fifo  = new Fifo(node.max, []);
		var cnt = 0;
        this.on('input', function(msg) {
			// Push the value on to the fifo and output the fifo as a message.
			values = JSON.parse(msg.payload);
            fifo.push(values);
	    	var newMsg = {payload: JSON.stringify(fifo) }
            node.send([newMsg, null]);
			// Output the average every 'n' samples n the second output.
			if(cnt == fifo.length-1) {
				cnt=0;
				var sum  = fifo.reduce(function(a, b) { return a + b; }, 0);
				var average  = sum /  fifo.length;
				node.send([null,{payload: JSON.stringify(average)}])
			} else {
				cnt++;
			}
        });
    }
    RED.nodes.registerType("journal",Journal);
}
