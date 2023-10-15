## broker
Broker丢失消息是由于Kafka本身的原因造成的，kafka为了得到更高的性能和吞吐量，将数据异步刷盘。会先放在page cache中。
存在page cache中，如果这个时候挂掉，会丢失数据。


>刷盘触发条件有三：
1. 主动调用sync或fsync函数
2. 可用内存低于阀值
3. dirty data时间达到阀值。dirty是pagecache的一个标识位，当有数据写入到pageCache时，pagecache被标注为dirty，数据刷盘以后，dirty标志清除。

kafka无法保证broker百分百不丢失数据。减少刷盘间隔，减少刷盘数据量大小。总之就是增加刷盘的频繁度，但是自然就会影响到性能，这个只能是权衡。

## producer
为了提升效率，kafka producer采用batch发送的方式。
写入mq的数据会先放到一个内存buffer中，之后异步发送。
如果这个时候producer挂掉，那么内存buffer的消息就会丢失

producer发送给broker时，如何知道发送成功了，有一个比较关键的参数就是ack
ack=0时，无需等待leader broker返回ack即认为成功。
ack=1时，leader broker返回ack即可认为成功。
ack=-1时，需要leader broker收到所有位于isr队列中的slave返回ack，才认为成功。

## consumer
consumer如果配置为自动commit，消费失败时可能会丢失消息。
可以配置为手动commit，保证业务返回成功再commit，这样子做可以保证消息至少被消费一次（at least once）但是这可能导致重复消费。
