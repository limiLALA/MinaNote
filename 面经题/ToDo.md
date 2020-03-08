## 高频知识点
#### MySQL
* 事务
  * 事务特性（ACID）
  * 事务的隔离级别（读未提交、读已提交、不可重复读、序列化）
  * 分别能解决哪些问题（脏读、不可重复读、幻读丢失修改）
  * MVCC（多版本并发控制）
  * 事务的回滚（undo、redo日志）

* 索引
  * 索引有哪几种
  * 索引的底层实现，b+树和红黑树的比较、和b树的比较
  * 索引失效
  * 索引优化策略
  * explain慢查询优化

* 存储引擎
  * MyISAM 和 InnoDB 的区别
  * 两者之间索引结构的区别
  * 各自的使用场景

* 锁（共享锁、排他锁、行锁、表锁、间隙锁）
* SQL语句（常见聚类函数的使用、表连接查询）

#### Java基础
* 集合类
  * HashMap 和 ConcurrentHashMap（基本上是场场必问，需要了解源码）
  * ArrayList、LinkedList、TreeMap、LinkedHashMap、HashSet等需要了解底层数据结构和各容器之间的优劣势
  * HashMap 和 ConcurrentHashMap在JDK不同版本的改动以及原因(JDK1.7、JDK1.8)
* 常见基础（这个很多，可以参考其他面经，我这里只提几个比较经典的）
  * String为什么不可变
  * String、StringBuilder、StringBuffer的对比
  * 接口和抽象类的区别
  * 单例模式（几种实现方式的区别最好具体了解下，因为从这里可以问到JVM中的内存结构和JVM对于多线程的一些处理策略）
* JVM（较重要）
  * 类加载机制
  * 常见GC算法
  * JVM内存模型
  * JVM运行时内存区域
  * 常见垃圾收集器（主要是CMS、G1，知道ZGC并且能说出原理是加分项）
  * 常见的启动参数
  * JVM内存溢出的分析过程
  * 锁（主要是synchrized、volatile这两个关键字在JVM中执行的行为）
* 并发编程
  * 创建线程的几种方式
  * 线程池原理以及参数含义
  * 死锁产生条件以及解决策略
  * J.U.C下部分类源码阅读
  * Lock接口下实现的锁和synchrized关键字的比较, 还有各自的优缺点
  * AQS（抽象队列同步器）

#### Redis（一般是结合项目问）
  * 常见用途
  * 底层数据结构（SDS、字典、跳跃表、链表、压缩数组、整数列表这几个都需要了解）
  * RDB 和 AOF 两种不同备份方式的比较以及优缺点（从各自原理、性能、稳定性答）
  * 跳表和红黑树之间的比较（从插入效率、实现方式、内存消耗以及特殊条件查询几方面进行比较）
  * SDS和原始字符串的比较（从缓冲区溢出、扩容方面答）
  * 字典和HashMap的比较（扩容方式、扩容大小）

#### 计算机网络
* TCP(需要深入了解)
  * TCP头部（大概知道头部能够传递哪些信息，常用的部分需要记住占据了多少bit）
  * 三次握手四次挥手（具体到两端之间的状态）
  * 每一次握手挥手失败的处理
  * 拥塞控制（慢开始，快重传、拥塞避免、快恢复）
  * 流量控制（零窗口的含义、接受窗口的协商）
  * Nagle（糊涂窗口综合症）
  * 常见的攻击（SYN泛洪攻击、DDoS）
* HTTP
  * Get 和 Post 的比较
  * Session 和 Cookie 的比较
  * 常用的 HTTP 头部
  * 常用的 HTTP 状态码
  * HTTP1.0、1.1、2.0三个版本各自的特性
  * HTTPS中的SSL握手过程
  * 常见的攻击(CSRF、XSS)

-----------------------------------------------
## Java基础
java内存模型
多态（重载重写）
object方法
类访问权限
sleep、notify、wait 联系、区别
String、stringbuffer、stringbuilder 联系、区别、源码
Volatile 原理、源码、与syn区别
线程间通信方式
线程的各种状态
等等等等


## 集合框架
### List
ArrayList
LinkedList
Vector
三者区别，联系，源码

### Set
HashSet
LinkedHashSet
TreeSet
基于什么实现，内部数据结构，适用场景，源码

### Map
HashMap
weakHashMao
LinkedHashMap
TreeMap
HashMap与hashtable的区别

内部实现原理、源码、适用场景

## 并发包
### ConcurrentHashMap
原理、源码、与hashmap的区别

### CopyOnWriteArrayList (set)
什么情况加锁、什么情况不加锁、适用场景

### ArrayblockingQueue (Linked)
两者区别，take、put、offer、poll方法原理、源码

### AtomicInteger (long boolean)
功能

### CountDownLatch
功能、场景

### CyclicBarrier
功能、场景

### FutureTask (Callable)
源码、场景

### ReentantLock
与syn的区别、好处、场景

### Condition
与wait、notify的区别、好处

### Semaphore
好处、场景

### ReentrantReadWriteLock
读写分离的好处、适用场景、源码

### Executors
线程池种类、各个作用、适用场景

### ThreadPoolExecutor
重载方法的参数、各参数作用、源码


## 虚拟机
JVM五大区

每个区的存储、作用
JVM内存模型

类加载机制
双亲委派模型

垃圾收集器
常用gc算法
收集器种类、适用场景
fullGC、MinorGC触发条件

JVM优化
可视化工具使用
日志查询
各项参数设置
四种引用


IO流
BIO

字节流：类型、适用场景
字符流：类型、适用场景

NIO
类型、适用场景
三大组件的联系、使用
内存情况


## 大数据
zookeeper
kafka
redis集群
storm
hadoop
spark
solr cloud

挑一两个组件深入理解下就好



## 数据库
三范式

主从复制

原理、实现

读写分离

原理、实现

事务

类型
使用
可能引起的问题

存储引擎

InnoDB
MyISAM
区别、联系、锁机制、适用场景

索引

类型
使用
什么样的字段适合做索引
SQL优化



## web
Tomcat

结构、流程、源码
Servlet

生命周期
三种实现方式

springMVC
使用
请求流程

spring

IOC/AOP 原理、源码、联系
两种动态代理实现

## mybatis

使用
#、$区别
一级、二级缓存


## 设计模式
单例模式
工厂模式
观察者模式
适配器模式
模仿方法模式
策略模式
责任链模式
装饰者模式

常用的八种掌握就行，原理，使用
单例、工厂、观察者重点


## 数据结构
二叉树

平衡二叉树
二叉查找树
红黑树
完全二叉树
满二叉树

概念、适用场景、时间复杂度、好处坏处
B树

B-Tree
B+Tree

两者的联系、区别、适用场景

## 算法
直接插入排序
二分插入排序
希尔插入排序
冒泡排序
快排
选择排序
堆排序
归并排序

各种排序的思想
实现复杂度
稳定性如何
可以手写

## 网络
TCP

三次握手、四次挥手、各种状态、状态改变
和UDP的区别

## IO模型

同步、异步、阻塞、非阻塞概念
模型种类、各自特点、适用场景
如何使用

## Linux基础
常用命令
管道符
查看日志相关命令
CPU使用命令

-----------------------------------------------
### 一面
如何查询比较高效
查询学生成绩大于等于60的所有人的姓名和编号

### 二面
mongodb底层原理或者数据结构是什么，事务处理，插入和mysql有什么区别，为什么会慢
类加载过程（Java），每一步做了什么
子类和父类的实例变量和方法有什么区别
重载和覆盖区别，返回值类型不同，可以重载吗，为什么，底层如何实现的
java多线程，状态图，画出来，阻塞的状态有哪几种，运行顺序，多线程的一些方法
java泛型
ThreadLocal，Concurrent下面的包，原理是什么，

@Transaction的原理，还有比如在一个类中两个方法，一个是B方法，一个是C方法，B上没有注解，C上有那么在外面调用B方***有事务，为什么，根据底层原理能不能推断出来（给提示问你能不能推断出来）
查询学生成绩不及格的所有人的姓名和编号，根据这个语句，如何建立索引，为什么，
mysql底层是什么，为什么效率高，主键能不能太大，为什么，如果太大，底层数据结构会不会变化，为什么
linux查询tcp连接处理CLOSE_WAIT的状态的数目
了不了解RabbitMQ，kafka，RocketMQ，ActiveMQ，以及其他消息中间件
redis为什么效率高，线程，数据结构，网络模型，aio，nio，bio，为什么这么设计？如何处理高并发

### 三面
数据仓库，雪花模型和星型模型区别和用处，数据仓库的过程（分层），如何设计
数据仓库和数据湖的区别
分布系统的设计，分布式系统CAP，分布式系统的模型
linux环境下的线上业务管理  有没有，如何管理
redis的集合有没有限制，限制是多少
redis的1w条的插入和更新有什么区别
mysql join的底层原理是什么，有哪几种（不是左右连接这种）
linux命令查询一个文件内出现重复最多的数字的
linux命令查询一个文件的行数

## 虾皮技术面一面（from ninn chyan）

hashtable hashmap comcurrenthashmap的区别
哈希冲突怎么解决
开放定址法有什么好处
冲突还可以使用什么方法解决
红黑树的基本特征
java new一个对象的过程
乐观锁悲观锁

mysql事务的特性，隔离级别
怎么实现的事务隔离
乐观锁，悲观锁在数据库业务中怎么做
varchar和text的区别
mysql锁怎么使用
innodb索引的物理结构
