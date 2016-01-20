#Node Red Journal Node

This node take a series of  messages assumed to be numeric values or objects, parses them
and stores them in a fixed sized FIFO array. Each time a message
arrives, it sends out the fifo.

Optionally, the journal can be persisted. If this is used, the storeName option
should be set to a unique string and the interval should be set to the number
of seconds between persisting the values.

The node will also send an average of all the values in the fifo every _fifo-length_ messages 
to the second output. This means the nodes can be cascaded to implement
a round-robin style, in-core, time series database.

This node has been designed to be used with ThingStudio and the widgets which
take journal inputs, such as the Sparkline widget.
