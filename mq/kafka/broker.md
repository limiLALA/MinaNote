## broker存储具体的partition
每一个partition为了高可用都会做主从，
broker会维护一个HW，代表消费者最多可以拉取的offset
LEO则指向的是即将要写入的offset
HW由ISR中最大的LEO决定

## broker如何存储数据
顺序写入具体的partition，这一步只是写到page cache
后面异步刷盘

## broker挂了怎么办
如果只有一个broker，那么就会有单点问题。此时kafka不可用。
如果有副本，那么此时会选举partition的leader

## broker新增怎么办
此时broker会进行rebalance

## partition如何确定存活
巧妙利用zookeeper的临时节点。
partition会在zookeeper上注册一个临时节点。
不同的broker都会监听该节点。
partition宕机，那么节点就会删除，broker会感知到，从而开始选举partition的leader
