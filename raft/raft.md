## 什么是raft
一种强一致性的分布式协议
数据的写入是以日志的append形式进行
日志一切以leader为主

## 节点几种状态
leader leader会和follower保持心跳包
follower follower发现leader心跳包没了,会prevote,如果prevote成功,就会变成一个candidate
candidate 要开始竞选leader


## 如何写入数据
写到leader,leader会同步给follower,超过半数的follower ack了,就视为成功
leader会commit
follower也会在和leader的心跳中去同步日志



## 选主
超过心跳包超时时间之后，follower变成candidate，投自己一票，然后要求别人投自己。
接收到要求投票的信息之后，会修改自己的term为要求投票的信息，然后对比自己的log
如果自己的log的offset更大，那么会拒绝投票给这个candidate
