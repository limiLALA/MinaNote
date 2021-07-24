# 版本 1.8
# 概述
* ### 继承自 J.U.C.AbstractExecutorService
>顶层接口为 Executor 然后是 ExecutorService

# 重要attr
## maximumPoolSize：
>**线程池中允许的最大线程数。**
线程池的阻塞队列满了之后，如果还有任务提交，如果当前的线程数小于maximumPoolSize，则会新建线程来执行任务。注意，如果使用的是无界队列，该参数也就没有什么效果了。

## corePoolSize
>**线程池中核心线程的数量。**
当提交一个任务时，线程池会新建一个线程来执行任务，直到当前线程数等于corePoolSize。
如果调用了线程池的prestartAllCoreThreads()方法，线程池会提前创建并启动所有基本线程。

## keepAliveTime
>**线程空闲的时间。**
线程的创建和销毁是需要代价的。线程执行完任务后不会立即销毁，而是继续存活一段时间：keepAliveTime。
默认情况下，该参数只有在线程数大于corePoolSize时才会生效。

## RunState
>
* ### RUNNING    = -1 << COUNT_BITS;
RUNNING 自然是运行状态，指可以接受任务执行队列里的任务
* ### SHUTDOWN   =  0 << COUNT_BITS;
SHUTDOWN 指调用了 shutdown() 方法，不再接受新任务了，但是队列里的任务得执行完毕。
* ### STOP       =  1 << COUNT_BITS;
STOP 指调用了 shutdownNow() 方法，1 不再接受新任务，2 抛弃阻塞队列里的所有任务，3 中断所有正在执行任务。
* ### TIDYING    =  2 << COUNT_BITS;
所有任务都终止了，在调用 shutdown()/shutdownNow() 中都会尝试更新为这个状态。
* ### TERMINATED =  3 << COUNT_BITS;
TERMINATED 终止状态，当执行 terminated() 后会更新为这个状态。
注意:
* SHUTDOWN == 0
* RUNNING < 0
* RUNNING + STOP == 0
* 小于 shutdown 就可以认为任务要继续完成


## ctl
>是一个 AtomicInteger 类型的引用。
>>ThreadPoolExecutor用这一个变量保存了两个内容：
* ### 所有有效线程的数量，低29位
* ### 各个线程的状态（runState），高3位

> ### 其中低29位存线程数，高3位存runState
相关的有三个打包和解包算法
```java
//获得线程池状态
private static int runStateOf(int c)     { return c & ~CAPACITY; }
//获得线程池中的任务数量
private static int workerCountOf(int c)  { return c & CAPACITY; }
//获得这个ctl
private static int ctlOf(int rs, int wc) { return rs | wc; }
```



## BlockingQueue<Runnable> workQueue
```java
private final BlockingQueue<Runnable> workQueue;
```
>用来保存等待执行的任务的 **阻塞队列**，等待的任务必须 **实现Runnable接口** 。
有以下几种选择：
* ### ArrayBlockingQueu
基于数组array结构a的有界阻塞队列，FIFO。
* ### LinkedBlockingQueue
基于链表linkedlist结构的有界阻塞队列，FIFO。
* ### SynchronousQueue
 **不存储元素** 的阻塞队列，**每个插入操作都必须等待一个移出操作，反之亦然** 。
* ### PriorityBlockingQueue
具有优先级别的阻塞队列。


## ReentrantLock mainLock
```java
private final ReentrantLock mainLock = new ReentrantLock();
```
> 主锁 用于 保证对worker的访问的互斥。

## HashSet<Worker> workers
```java
private final HashSet<Worker> workers = new HashSet<Worker>();
```
> 用于维护和管理所有的 worker

## ThreadFactory threadFactory
```java
private volatile ThreadFactory threadFactory;
```

## RejectedExecutionHandler handler
```java
private volatile RejectedExecutionHandler handler;
```
>拒绝策略。在worker到达max，且阻塞队列已满的时候执行的策略
线程池提供了四种拒绝策略：
> ### AbortPolicy：直接抛出异常，***默认策略***；
> ### CallerRunsPolicy：用调用者所在的线程来执行任务；
> ### DiscardOldestPolicy：丢弃阻塞队列中靠最前的任务，也就是预留一个位置，防止阻塞队列已满，然后再调用execute方法走一遍流程。
> ### DiscardPolicy：直接丢弃任务；
根据源码来看其实啥也没做。

# 构造方法


# 重要方法

##  addWorker(Runnable firstTask, boolean core)
> ***外层循环***
> 首先获取当前的 ctl，然后根据ctl获取当前线程池状态 RunState
> 根据 runstate 分类讨论
>> ### 如果 线程池不在运行状态
那么分情况
>>> ### 线程池已经在stop甚至tidying了
此时不会再处理余下的任务，直接返回
>>> ### 线程池在shutdown的状态
此时还会运行余下的任务
>>>> ### 如果提交的任务 firstTask 为空，而且队列没任务了，
就返回不再加线程
>>>> ### 如果队列还有任务
那么接着执行下面的逻辑
> ***内层循环***
> 在确保当前线程池运行状态不变的情况下，循环下面逻辑
> ### 获取当前线程数量
如果已经超过容量了，就直接返回
>根据 core 分类讨论
>> ### 如果 core 为 true
说明要添加的是核心线程，所以要和corePoolSize比较，添加这个线程是不会有存活时间限制的。
>> ### 如果 core 为false
说明要添加的是临时工线程，所以和maxPoolSize比较。
>使用cas操作尝试 add worker操作
>> ### 如果 失败
那么获取最新的ctl，然后根据线程池的状态分类
>>> ### 如果线程池状态变化了
回到外层循环
>>> ### 否则
说明线程池状态没变，继续内层循环
>> ### 如果成功
> ### 那么开始进入线程真正的创建逻辑
> ### 首先新建worker对象
对象中就包含一个thread t
> ### 如果 t合法
对 mainlock 做上锁
然后获取线程池状态
根据线程池状态分类讨论
>> ### 处于 RUNNING
说明要新建线程来处理任务
>> ### 处于 SHUTDOWN 但是任务为空
说明要将积压的任务做完
>> ### 如果处于其他的状态
跳出 添加worker线程的逻辑，
走addWorkerFailed处理
>
>> ### 如果 t 已经处于 运行状态
则抛异常
>
>将worker放入 workers 中，便于管理
获取此时的是线程总数，如果大于 largestPoolSize ，就赋值
最后释放主锁







## execute(Runnable command)
```java

```
> ### 首先通过ctl获取当前线程池的状态c，然后分情况讨论
>> ### 当前线程数量小于coreSize
那么走 addWorker(core=true) 创建一个新的线程来执行这个任务
>>> ### 如果成功
则直接返回
>>> ### 不成功
则再次通过ctl获取线程池的状态c
>> ### 当前线程数量超过coreSize
>> 分类讨论线程池的当前状态
>>> ### 如果当前线程池处于运行状态，而且加任务到任务阻塞队列成功
之后做双重检查，也就是再次通过ctl获取c，按照c的状态分类讨论
>>>> ### 如果此时线程池处于非运行状态
则需要移除任务
>>>> ### 如果此时线程池为空
则走 addWorker(core=false)，新建一个worker线程去阻塞队列中拿任务做。
这里应对的应该是处于空闲状态的cachedThreadPool，因为它的core是0
>>> ### 如果失败了，可能线程池处于非运行状态，也有可能阻塞队列已经满了。
>>> ### 那么尝试 addWorker(core=false)
>>>> ### 增加线程成功
说明线程池还在running，只是阻塞队列满了，增加了一个线程来做这个新的任务
>>>> ### 否则说明线程池线程达到max了
那么只能拒绝任务

## submit()
> ### 执行有返回值的任务
传入的东西可以是 Runnable 或者 callable，最终都会转为callable
然后返回一个Future<T> 给调用者，以获取返回值。


## runWorker(Worker w)
> ### 调度 worker 线程的 重要方法
首先获取当前线程对象 wt 和 worker w的第一个任务
将 w解锁，让调用interrupt起作用
进入 **循环**
>> ### 如果第一个任务不为空，或者任务队列有任务
说明要开始work了
>> ### 否则说明无事可做
跳出 循环 运行结束
>开始work，对worker上锁
此时无法对该worker做任何处理。
然后 检查线程 wt 的状态和线程池的状态
>> ### 如果线程池已经处于stop状态
说明要停止wt线程了
### 如果此时wt还不处于interrupted
那么改为interrupted




# 重要内部类
## Worker
```java
private final class Worker
        extends AbstractQueuedSynchronizer
        implements Runnable{

        }
```
> ### 继承了AQS同步器
Worker也可以获取锁，释放锁
一旦worker开始进入获取并完成一个任务的逻辑就会上锁。
> ### 实现了Runnable
worker本质也是一个可以执行的任务。


### 构造函数
#### Worker(Runnable firstTask)
```java
Worker(Runnable firstTask) {
    //设置AQS的同步状态private volatile int state，是一个计数器，大于0代表锁已经被获取
    setState(-1);
    this.firstTask = firstTask;
    // 利用ThreadFactory和 Worker这个Runnable创建的线程对象
    this.thread = getThreadFactory().newThread(this);
}
```


### 重要方法
#### run()
> ### 该方法调用了 ThreadPoolExecutor 对象的 runWorker方法，worker的处理逻辑由主类维护
