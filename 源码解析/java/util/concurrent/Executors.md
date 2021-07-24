# 版本 1.8
# 概述
* ### 这是线程池的一个工具类
>可以用来创建自带参数的一些线程池，满足大部分的业务场景需求。


# Constant
# Field



# 重要方法
## new*ThreadPool 系列
>Java中使用线程池技术一般都是使用Executors这个工厂类，它提供了非常简单方法来创建各种类型的线程池

### newFixedThreadPool
```java
// corePoolSize == maximumPoolSize == nThreads
public static ExecutorService newFixedThreadPool(int nThreads)
```
>* corePoolSize 和 maximumPoolSize都设置为创建FixedThreadPool时指定的参数nThreads
* 当线程池满时且阻塞队列也已经满时 **直接走拒绝策略**
* keepAliveTime设置为0L，表示空闲的线程会立刻终止。
* workQueue则是使用 **LinkedBlockingQueue**，但是没有设置范围 基本就相当于一个 **无界队列**
>### 无界队列会带来两个影响：
>> ### maximumPoolSize 失效
在线程数到达core之后，因为队列无法爆满，所以无法触发新建线程。所以 maximumPoolSize 失效
>> ### 拒绝策略AbortPolicy 失效
拒绝策略要满足两个条件才生效，一是阻塞队列已满，二是线程数量已经达到max。这俩条件都无法达到，因此 拒绝策略失效。



### newSingleThreadExecutor
```java
//corePoolSize == 0
public static ExecutorService newSingleThreadExecutor()
```
> ### 使用单个worker线程的Executor
SingleThreadExecutor把 **corePoolSize** 和 **maximumPoolSize** 均被设置为 **1**
> ### 使用 无界队列 **LinkedBlockingQueue**
所以带来的影响和FixedThreadPool一样。

### newCachedThreadPool
```java
// maximumPoolSize == corePoolSize == 1
public static ExecutorService newCachedThreadPool()
```
>一个会**根据需要创建新线程**的线程池
* ### corePool = 0
意味着所有的任务一提交就会加入到阻塞队列中
* ### maximumPoolSize = Integer.MAX_VALUE
* ### 阻塞队列采用的 **SynchronousQueue**
不存储任务，因此一提交就要想办法做。因为maxsize很大，所以如果提交任务的速度过快，可能创建过多线程，耗尽系统资源
* ### keepAliveTime 为60L unit 为TimeUnit.SECONDS
意味着空闲线程等待新任务的最长时间为60秒，空闲线程超过60秒后将会被终止。
* ### 适合空闲时间比较多的业务场景
因为每个线程都有超时限制，空闲时就不会有线程存在。

### newScheduledExecutorService
```java
// workQueue == new DelayedWorkQueue()
public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize)
```
>一个用于定时任务执行的线程池
* ### corePool = 0
意味着所有的任务一提交就会加入到阻塞队列中
* ### maximumPoolSize = Integer.MAX_VALUE
* ### 阻塞队列采用的 **DelayedWorkQueue**
默认初始长度为16，会调用grow函数进行扩容。
* ### keepAliveTime 为0 unit 为TimeUnit.SECONDS
* ### 适合以下业务场景
>> * 指定延时后执行任务。
>> * 周期性重复执行任务。
