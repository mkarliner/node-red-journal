#Node Red Journal Node


A node that implements a persistable fixed length FIFO for basic time series operations

Journal takes input messages and buffers them up to its maximum length. 
Journal can be work in two different modes, clocked and message driven. 

In clocked mode, arriving messages are cached and added to the journal every 'clock interval' seconds, which is then output. 

In message driven mode, the journal is added to and output every time new messages arrive.

Every 'maximum entries' input messages, the journal outputs a message which is the average of all input messages in the journal. This enables cascading of journals in successively longer time series. 

Note that if the input messages are objects rather than simple numbers, you should specify the 'Keys to average' property, which is a comma separated list of message properties to be averaged. All other properties of the message will be passed through to the next journal unchanged from the last received message.


This node has been designed to be used with ThingStudio and the widgets which
take journal inputs, such as the Sparkline widget.
