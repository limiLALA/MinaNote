## codis架构
client和codis fe加上dashboard都可以访问到codis proxy

## 如何分片
分片的规则，是基于redis的key进行CRC32的运算（循环冗余检测），然后再进行一个一致性哈希。最终落到一个slot上。
他有一个显著的优点，就是proxy本身是一个无状态的存在，无状态意味着可以很方便地进行水平扩展。

## 高可用
codis proxy本身是集群.
codis ha可以利用k8s的冗余副本的配置,发现codis proxy状态不对就干掉,k8s会自动拉起一个新的codis proxy

redis 分片数据做主从.
codis proxy获取具体slot消息从zookeeper 上.

slot的具体信息会记录在zookeeper上,proxy确定具体的slot之后通过zookeeper来访问具体的slot
codis使用codis-ha对codis proxy集群进行监控，同时也对分片的master-slave进行监控，将redis sentinal去掉了。

## 相关连接
https://www.cnblogs.com/pingyeaa/p/11294773.html
https://blog.csdn.net/weixin_41762839/article/details/104829839
https://blog.csdn.net/QQ1006207580/article/details/103243281
