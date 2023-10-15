### doAcquireShared
获取共享锁的操作
[并发编程——详解 AQS CLH 锁](https://www.jianshu.com/p/4682a6b0802d?tdsourcetag=s_pcqq_aiomsg)

AQS使用了一个虚拟head节点，原因是，当LCH队列中有一个线程要阻塞的时候，会将前一个节点的ws设置为SIGNAL，表示在前一个线程执行完毕后要负责唤醒后面的这个线程，否则后面的线程永远都无法被唤醒。
此时，第一个节点要阻塞时也要进行这样的操作，因此要在前面创建一个虚拟节点head，第一个线程要阻塞时就将head的ws设置为SIGNAL，然后安心的进入阻塞状态。

```Java
private void doAcquireShared(int arg) {
    final Node node = addWaiter(Node.SHARED);//将当前线程以共享锁的模式加入等待队列LCH中
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {
            final Node p = node.predecessor();
            if (p == head) {//检查前置结点是否是头结点，如果是，就可以去尝试拿锁
                int r = tryAcquireShared(arg);
                if (r >= 0) {
                    setHeadAndPropagate(node, r);//核心在setHead()方法，将node置为head并清空node中的thread和prev指针
                    p.next = null; // help GC //p已是一个废弃的node，要把相关的指针都解除，让GC去清理掉这个对象
                    if (interrupted)//如果前面的取锁操作失败，同时检测到中断被开启，尽管此次成功了，正在执行的线程也要要交出CPU的使用权，解除占用，进入阻塞
                        selfInterrupt();
                    failed = false;
                    return;
                }
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

private Node addWaiter(Node mode) {
    Node node = new Node(Thread.currentThread(), mode);//将线程对象与模式封装到node中
    // Try the fast path of enq; backup to full enq on failure
    Node pred = tail;//获取队尾
    if (pred != null) {//这段我个人认为是冗余的，不如直接调用enq()
        node.prev = pred;
        if (compareAndSetTail(pred, node)) {//如果一次成功还好，但是并发度一旦增大，就会有很多失败的线程又要进入enq()中再进行一次队空的判断。
            pred.next = node;
            return node;
        }
    }
    enq(node);
    return node;
}

private Node enq(final Node node) {
    for (;;) {//一直循环直至成功加入LCH队列为止
        Node t = tail;
        if (t == null) { // Must initialize //LCH队列尚未初始化
            if (compareAndSetHead(new Node()))  //LCH初始化，设置队头
                tail = head;
        } else {
            node.prev = t;
            if (compareAndSetTail(t, node)) {//CAS，比较成功则将node设置为tail
                t.next = node;
                return t;
            }
        }
    }
}

private void setHead(Node node) {
    head = node;
    node.thread = null;
    node.prev = null;
}
```

#### CountDownLatch中实现的
```Java
//state表示尚未完成工作（拿到共享锁）的子线程数目。一般由主线程调用。
protected int tryAcquireShared(int acquires) {
    return (getState() == 0) ? 1 : -1;
}

//一般由拿到共享锁的子线程在工作完成后调用，表示释放共享锁
protected boolean tryReleaseShared(int releases) {
    // Decrement count; signal when transition to zero
    for (;;) {
        int c = getState();
        if (c == 0)
            return false;
        int nextc = c-1;
        if (compareAndSetState(c, nextc))
            return nextc == 0;
    }
}
```
