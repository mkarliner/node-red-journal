#Node Red Journal Node

This node take a series of JSON encoded messages assumed to be numeric values, parses them
and stores them in a fixed sized FIFO array. Each time a messages
arrives, it sends out a JSON encoded version of the fifo.

The node will also send an average of all the values in the fifo every <fifo-length> messages 
to the second output. This means the nodes can be cascaded to implement
a round-robin style, in-core, time series database.

This node has been designed to be used with ThingStudio and the widgets which
take journal inputs, such as the Sparkline widget.
