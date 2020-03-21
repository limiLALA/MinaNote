# 思维导图
### 计网
###### icmp
	-> 查询报文 查询某个ip
	-》差错报文 -》 traceroute或者探寻链路最大mtu
###### 浏览器输入URL回车：
	本地Host无->DNS请求->获取IP
	ARP查询MAC地址
		局域网内->拿到主机的MAC->如何生成完整数据包->点对点直接发送(有线相连)/交换机转发/路由器转发
		外网->拿到路由器的MAC->如何生成完整数据包->发给路由器->NAT->根据路由选择协议发送给下一跳->...->最后一跳->NAT->ARP拿到目标主机的MAC->发给目标主机->解析数据包
	扩展：路由选择协议
		内部网关协议IGP：RIP（Floyd）、OSPF（Dijkstra）
		外部网关协议EGP：BGP（eBGP/iBGP）
###### DNS：
						客户端
	本地缓存<-本地DNS解析器
	本地缓存<-本地DNS服务器<->根域名服务器
											 <->顶级域名服务器
											 <->权威域名服务器
	递归解析or迭代查询

###### 滑动窗口：
-> 发送者
    -> 缓冲区分四个部分
    -> nagle 糊涂窗口
    -> 持续计时器
-> 接收者
    -> 缓冲区分三个部分
    -> clark 糊涂


### MySQL
###### 索引类型：
	唯一索引和普通索引->change buffer机制->buffer pool以页的形式组织->redo log和binlog容灾->redo log的两阶段提交(保证日志一致)->redo log是实现事务的机制->随机IO（直接刷回数据页）和顺序IO（redo log的持久化）
	聚簇索引和非聚簇索引->InnoDB与MyISAM的区别

### Spring+设计模式
###### spring mvc：
	前端控制器->Handler Adaptor->Controller(网络IO)->Service(业务)->Dao(访问数据库)
	返回JSON<-直接返回JSON<-返回ViewObject/JSON字符串<-处理并返回数据<-拿到数据

###### spring：
	IOC	->	bean factory / factory bean	->	工厂模式
	    ->	xml中声明singleton/prototype ->	区别
	DI	->	xml中声明properties，然后注入某个类的对象
	AOP
	工厂模式
		spring的工厂（IoC容器）：BeanFactory->读取xml->管理Bean
		->Bean种类
			按生命周期分：Singleton、Prototype
			按用途分：普通Bean、FactoryBean
		->BeanFactory与FactoryBean区别
	单例模式->Singleton->Bean类型->Java中的单例实现方式
		饿汉->内存占用
			静态代码块中初始化私有静态变量，利用类加载的线程安全机制
			枚举类实现
		懒汉->
			线程安全
				外层加锁->阻塞->用户到内核态切换开销
				双重校验锁->降低阻塞程度
				静态内部类->类加载的线程安全
				CAS->同步非阻塞
			线程不安全
				直接判空，不加锁，不处理并发
				单层加锁

### Java并发
-> 可见性 -> volatile -> 缓存一致性
-> 原子性 -> synchronize
-> 重排序 -> synchronize

### OS
###### 进程与线程
进程->页表->MMU（逻辑地址-物理地址映射）->TLB->线程切换开销少
进程，线程区别->再自己补充协程

###### IO模型：
	阻塞、非阻塞、复用、异步->IO复用的select、poll、epoll
	网络编程/socket
	-》 一个socket一个线程 -》 同步阻塞io -》 什么是同步阻塞io -》有什么缺点
	-》 io复用 -》同步非阻塞io -》 什么是同步非阻塞io -》 select/poll/epoll -》 比较
	-》 异步io -》 什么是异步io -》
