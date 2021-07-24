# 核心接口

## Executor
>核心的接口其实是Executor，它只有一个execute方法抽象为对任务（Runnable接口）的执行

## ExecutorService
>ExecutorService接口在Executor的基础上提供了对任务执行的生命周期的管理，主要是submit和shutdown方法

# 接口默认实现
## execute
* 活动线程小于corePoolSize的时候创建新的核心线程；
* 活动线程大于corePoolSize时都是先加入到任务队列当中；
* 任务队列满了再去启动新的线程，如果线程数达到最大值就拒绝任务。



```java
//CAPACITY值为：00011111111111111111111111111111
private static int runStateOf(int c) {
    return c & ~CAPACITY;
}
```

```java
//CAPACITY值为：00011111111111111111111111111111
private static int workerCountOf(int c) {
  //这里自然就是获取低 29 位
    return c & CAPACITY;
}

```

```java
// 这里自然就是把两个信息合起来返回
private static int ctlOf(int rs, int wc) {
    return rs | wc;
}
```

```java
// 只有RUNNING状态会小于0
private static boolean isRunning(int c) {
    return c < SHUTDOWN;
}
```
