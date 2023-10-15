## codis架构
分片的规则，是基于redis的key进行CRC32的运算（循环冗余检测），然后再进行一个一致性哈希。最终落到一个slot上。
他有一个显著的优点，就是proxy本身是一个无状态的存在，无状态意味着可以很方便地进行水平扩展。
codis使用codis-ha对codis proxy集群进行监控，同时也对分片的master-slave进行监控，将redis sentinal去掉了。
