# ReentrantLock: 重入锁
## 三种不同类型类的定义
```Java
interface Lock{}      // 接口：不能有方法体。可以有多个类去实现其中的方法(implements)
abstract class Lock{} // 抽象类：可以有方法体也可以没有。注意，抽象类不能定义实例对象
class Lock{}          // 类：必须有方法体。可以定义实例对象
```
#### Java中的单继承、多实现
**单继承**：一个类只能有一个前驱类（父类），可以有多个后继类（子类）。
**多实现**：一个接口(interface)可由多个类(class)来实现

## 重要类及内部类
```Java
public interface Lock {}  // 接口
public class ReentrantLock implements Lock, java.io.Serializable {  // 重入锁
  abstract static class Sync extends AbstractQueuedSynchronizer {}  // 对AQS的基准实现
  static final class NonfairSync extends Sync {}  // 非公平的队列同步机制：后来的线程也可尝试竞争锁资源
  static final class FairSync extends Sync {}     // 公平的队列同步机制：后来的线程不可竞争锁资源，必须在队列中等待
}
public abstract class AbstractQueuedSynchronizer  // AQS：抽象队列同步机制
    extends AbstractOwnableSynchronizer
    implements java.io.Serializable {}
```

### ReentrantLock中NonfairSync的实现
```Java
static final class NonfairSync extends Sync {
    private static final long serialVersionUID = 7316153563782823691L;

    /**
     * Performs lock.  Try immediate barge, backing up to normal
     * acquire on failure.
     */
    final void lock() {
        if (compareAndSetState(0, 1)) //如果锁没有被占用，就将锁的state设置为1，表示已被占用
            setExclusiveOwnerThread(Thread.currentThread());  //将拥有此锁的线程设置为排他拥有者线程
        else
            acquire(1); //此方法的实现在外部类AQS中，最终会调用下面的tryAcquire方法
    }

    protected final boolean tryAcquire(int acquires) {
        return nonfairTryAcquire(acquires); //该方法的实现在父类Sync中
    }
}
```
AQS中acquire的实现
```Java
public final void acquire(int arg) {
    if (!tryAcquire(arg) && //获取锁的尝试失败
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))//将当前线程加入阻塞队列中
        selfInterrupt();
}
```
Sync中nonfairTryAcquire的实现
```Java
final boolean nonfairTryAcquire(int acquires) {//线程安全的取锁操作
    final Thread current = Thread.currentThread();
    int c = getState();
    if (c == 0) {
        if (compareAndSetState(0, acquires)) {//最终将调用不会被中断的本地方法来进行资源的访问与修改
            setExclusiveOwnerThread(current);
            return true;
        }
    }
    else if (current == getExclusiveOwnerThread()) {
        int nextc = c + acquires;
        if (nextc < 0) // overflow
            throw new Error("Maximum lock count exceeded");
        setState(nextc);
        return true;
    }
    return false;
}
```

```Java
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
