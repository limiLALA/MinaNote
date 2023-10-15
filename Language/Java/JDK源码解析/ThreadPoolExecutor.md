* 线程池是Executor框架中最核心的类。
* 线程池最核心的一个变量是**ctl**，类型为AtomicInteger，其高3位表示线程池状态，低29位表示线程数目。

## 内部状态
线程的5大状态：新建，就绪，运行，阻塞，终止
线程池的5大状态：RUNNING, SHUTDOWN, STOP, TIDYING, TERMINATED

##### 线程池的状态
RUNNING：运行态，可接受新任务，也可生成新线程对象去执行任务。
SHUTDOWN：关闭态，不接受新任务，仅可生成线程去执行已有的任务。
STOP：暂停态，不接受新任务，不执行，相当于完全阻塞。
TIDYING：清理态，此时所有任务终止，且线程数目为0。随后会执行钩子（回调）函数terminated()。此函数在ThreadPoolExecutor中是空的，如果想在线程池进入TIDYING时，做出相应的处理，可以重写terminated()。
TERMINATED：终止态，进入此状态意味着线程池已经完全终止，可以通过isTerminated()方法进行判断。

## 创建线程池
```java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler) {
    if (corePoolSize < 0 ||
        maximumPoolSize <= 0 ||
        maximumPoolSize < corePoolSize ||
        keepAliveTime < 0)
        throw new IllegalArgumentException();
    if (workQueue == null || threadFactory == null || handler == null)
        throw new NullPointerException();
    this.corePoolSize = corePoolSize;
    this.maximumPoolSize = maximumPoolSize;
    this.workQueue = workQueue;
    this.keepAliveTime = unit.toNanos(keepAliveTime);
    this.threadFactory = threadFactory;
    this.handler = handler;
}
```
共7个参数：
1. corePoolSize：核心线程数目。每当有新任务添加进来时，如果当前线程数没有达到这个核心线程数，就会创建一个新线程来处理这个新任务。
2. maximumPoolSize：最大线程数目。
3. keepAliveTime：当一个线程空闲下来时，闲置时间超过这个允许存活时间时才会被销毁。
4. unit：keepAliveTime参数的单位。
5. workQueue：阻塞队列，用于存放暂时无线程来处理的任务，这些任务对象必须实现Runnable接口，具体的任务在run方法中重写。可选的阻塞队列如下：
>* ArrayBlockingQueue：基于数组结构的有界阻塞队列，FIFO。
* LinkedBlockingQueue：基于链表结构的有界阻塞队列，FIFO。
* SynchronousQueue：只能存储一个元素的阻塞队列，每一个插入操作都必须等待一个移出操作，反之亦然。
* PriorityBlockingQueue：具有优先级别的阻塞队列。
6. threadFactory：线程工厂，用于创建合适的线程来处理任务。线程工厂创建的都是“非守护线程”
7. handler：RejectedExecutionHandler，线程池的拒绝策略。当向线程池提交任务时，如果线程池中的线程已经饱和了，且阻塞队列也满了，就会采取某种拒绝策略处理该任务。
>* AbortPolicy：直接抛出异常，默认策略；
* CallerRunsPolicy：用调用者所在的线程来执行任务；
* DiscardOldestPolicy：丢弃阻塞队列中靠最前的任务，并执行当前任务；
* DiscardPolicy：直接丢弃任务.   
也可以实现自己的拒绝策略，例如记录日志等等，实现RejectedExecutionHandler接口即可。

## 线程池
Executor框架提供了3种线程池，他们可通过工具类Executors来创建。
### FixedThreadPool
```Java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>());
}
```
* 可重用固定线程数目的线程池，corePoolSize=maximumPoolSize=nThreads，nThreads是创建FixedThreadPool时给定的参数。
* keepAliveTime为0L，表示空闲进程会立刻终止。
* 拒绝策略默认使用AbortPolicy。
* 阻塞队列使用LinkedBlockingQueue，但是没有指定范围，默认为最大值(Integer.MAX_VALUE)，因此是无界队列。当有新任务进来时，如果线程数没有达到corePoolSize，就会创建新的线程来处理这个任务；如果达到了corePoolSize，就会将任务加入workQueue。由于阻塞队列无界，因此拒绝策略无效，因为永远也不会拒绝新的任务加入。如果提交任务的速度快于执行任务的速度，keepAliveTime也将无效。

### SingleThreadExecutor
```Java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}
```
SingleThreadExecutor是只使用单个worker线程的Executor。corePoolSize=maximumPoolSize=1，其他参数与FixedThreadPool一致，带来的影响也是一样的。

### CachedThreadPool
```Java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}
```
* CachedThreadPool会根据需要创建新线程。
* corePoolSize=0表示一旦有任务提交就会放入阻塞队列。maximumPoolSize=Integer.MAX_VALUE表示可以创建大量线程，意味着如果一次性提交任务过多，就会创建大量线程消耗资源。
* keepAliveTime=60L，单位是SECONDS，表示每个线程的空闲存活时间为60秒，60秒后仍没有新任务，就会被终止。
* 使用的workQueue是同步队列，只能暂时存放一个任务，意味着如果没有空闲线程，一旦提交任务就会创建新线程来执行任务。如果提交任务的速度过快，就会创建大量线程，可能会导致系统耗尽CPU和内存资源。所以使用CachedThreadPool时一定要注意控制任务的并发数，避免导致严重的性能问题。

## 任务提交
