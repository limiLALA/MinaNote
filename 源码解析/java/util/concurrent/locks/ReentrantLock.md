# 版本
# 概述
# 重要内部类
## Sync
```java
abstract static class Sync extends AbstractQueuedSynchronizer {

}
```
> 这是对 AQS 的一个基准实现

## 重要方法
### nonfairTryAcquire(int acquires)
### tryRelease(int releases)
```java
protected final boolean tryRelease(int releases) {
    int c = getState() - releases;
    if (Thread.currentThread() != getExclusiveOwnerThread())
        throw new IllegalMonitorStateException();
    boolean free = false;
    if (c == 0) {
        free = true;
        setExclusiveOwnerThread(null);
    }
    setState(c);
    return free;
}
```
> 该方法对于fair 或者 unfair都是一样的实现
> 首先获得release后的state c
>> ### 如果释放完c等于0
那么资源是free的，并且没有独占的线程。
> 最后返回资源是否是free的




## NonfairSync
## 重要方法
### lock()
```java
final void lock() {
    if (compareAndSetState(0, 1))
        setExclusiveOwnerThread(Thread.currentThread());
    else
        acquire(1);
}
```
> 实现了 AQS的lock方法
>> ### 如果将state从空闲修改为占有成功
那么就设置当前的线程为独占线程
>> ### 如果失败
那么有两种可能性
>>> ### 当前线程已经获取锁
此时为重入
>>> ### 当前线程没有获取锁
那么要进入阻塞队列
>> ### 无论如何，都得走 nonfairTryAcquire 方法尝试占有资源
在这个方法中会对当前线程是否重入做判断。
然后如果在这个过程中state变为0，资源又可用了，就会独占资源，此谓 **二次检验**。
>>> ### 如果尝试占有成功
那么就返回true
>>> ### 否则
就要走 aquireQueued 函数
尝试将当前线程封装为一个阻塞队列的结点
然后加入道阻塞队列中。
>>>> ### 如果加入阻塞队列成功
那么就会走 selfInterrupt 调用自己的interrupt函数
>>>> ### 如果连加入阻塞队列都失败
那么说明竞争非常激烈或者出现某些异常
不再做任何操作。


### tryAcquire
> ### 本函数是再 AQS 中 的acquire中进行调用的
acquire 一共分为两个步骤
tryAcquire为第一步。
特化调用了 NonfairSync的tryAcquire
这里分为两种情况
>> ### 资源空闲出来了
那么CAS尝试占有资源，失败返回false
>> ### 锁重入
那么将资源增加上acquires的数目然后返回true
> 其他的情况都返回false
返回false之后，AQS就会采取第二个步骤 acquireQueued 在队列中进行竞争。



## FairSync
