# 版本
# 概述
* ### SynchronousQueue没有容量
>每一个put操作必须要等待一个take操作，否则不能继续添加元素，反之亦然。
因为没有容量，所以对应 peek, contains, clear, isEmpty … 等方法其实是无效的。例如clear是不执行任何操作的，contains始终返回false,peek始终返回null。

* ### SynchronousQueue分为公平和非公平
>默认情况下采用非公平性访问策略，当然也可以通过构造函数来设置为公平性访问策略（为true即可）。

* ### 若使用 TransferQueue, 则队列中永远会存在一个 dummy node

* ### SynchronousQueue非常适合做交换工作
>生产者的线程和消费者的线程同步

# 重要 attr
# 构造函数
## SynchronousQueue(boolean fair)
```java
public SynchronousQueue() {
        this(false);
}

public SynchronousQueue(boolean fair) {
    // 通过 fair 值来决定公平性和非公平性
    // 公平性使用TransferQueue，非公平性采用TransferStack
    transferer = fair ? new TransferQueue<E>() : new TransferStack<E>();
}
```


# 重要函数

# 重要内部类
## Transferer
```java
abstract static class Transferer<E> {
    abstract E transfer(E e, boolean timed, long nanos);
}
```
> ### 提供transfer方法
该方法定义了转移数据的规范

## TransferQueue
> ### TransferQueue是实现公平性策略的核心类，其节点为QNode


## TransferStack
