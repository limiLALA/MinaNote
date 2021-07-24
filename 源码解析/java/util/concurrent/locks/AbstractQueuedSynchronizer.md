# 版本
# 概述
# Field
## state
```java
private volatile int state;
```
>这是 AQS 的核心变量，使用volatile修饰保证可见性
用于标识资源的占有情况。
state == 0 表示空闲
state > 0 表示有人在使用，而且state等于使用量
可能是共享，也可能是独占且重入


# Constant


# 重要方法
## acquire(int arg)
```java
public final void acquire(int arg) {
    if (!tryAcquire(arg) &&
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        selfInterrupt();
}
```
> AQS 提供的 获取资源的模板
分为两个步骤
一是 tryAcquire 尝试获取资源
二是 try失败之后尝试 acquireQueued 加入阻塞队列中竞争资源，Node由 addWaiter函数生成

## tryAcquire()
> 该方法，就交由实现类去具体实现，只要满足规范，返回acquire是否成功即可。
注意返回的是 boolean


## acquireShared(int arg)
```java
public final void acquireShared(int arg) {
    if (tryAcquireShared(arg) < 0)
        doAcquireShared(arg);
}
```
> AQS 提供的 获取共享锁的模板
分为两个步骤
一是 tryAquireShared 尝试获取共享锁
二是 try 失败之后尝试 doAcquireShared，
实际上依旧是加入到阻塞队列中去竞争锁。
内部依然使用addWaiter包装Node

## tryAcquireShared()
> 该方法，就交由实现类去具体实现，只要满足规范，返回acquire是否成功即可。
注意返回的是 boolean

## addWaiter(Node mode)
```java
private Node addWaiter(Node mode) {
    Node node = new Node(Thread.currentThread(), mode);
    // Try the fast path of enq; backup to full enq on failure
    Node pred = tail;
    if (pred != null) {
        node.prev = pred;
        if (compareAndSetTail(pred, node)) {
            pred.next = node;
            return node;
        }
    }
    enq(node);
    return node;
}
```
> ### 根据当前线程包装一个Node加入到阻塞的队列中。
包装Node完成后 CAS尝试 加入表尾
如果失败，走enq函数进行循环尝试。

## acquireQueued(final Node node, int arg)
```java
final boolean acquireQueued(final Node node, int arg) {
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {
            final Node p = node.predecessor();
            if (p == head && tryAcquire(arg)) {
                setHead(node);
                p.next = null; // help GC
                failed = false;
                return interrupted;
            }
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())
                interrupted = true;
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
```

##


# 构造函数
# 重要内部类
