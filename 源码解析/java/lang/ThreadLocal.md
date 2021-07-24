# 版本 1.8

# 概述
* ### ThreadLocal是为每一个线程创建一个单独的变量副本
* ### 线程同步机制是多个线程共享同一个变量，所以ThreadLocal并不解决线程同步的问题。
* ### ThreadLocal实例本身不存储值，它只是提供了一个在当前线程中找到副本值得key。
* ### ThreadLocal包含在Thread中，而不是Thread包含在ThreadLocal中


# Constant
# Field

# ThreadLocal定义了四个方法：



* ### initialValue()：
>返回此线程局部变量的当前线程的“初始值”。

* ### remove()：
> 移除此线程局部变量当前线程的值。

* ### getmap(Thread t)
>getmap函数会查看线程对象t中是否有ThreadLocal.ThreadLocalMap的对象实例，这里分两种情况讨论。
>> ### t 中有threadlocal实例
getmap函数会返回t的threadlocal实例
>> ### t 中没有threadlocal实例
返回null

* ### set(T value)：
> ### 将此线程局部变量的threadlocalmap中的key为this的value设置为指定值。
>> 首先获取当前的线程对象t。然后调用threadlocal对象的getmap函数，传入t，尝试获取map对象。
然后分两种情况讨论
>>> ### map对象不为空，那么以当前threadlocal对象的引用作为key，存入value。
>>> ### map对象为空，那么会创建一个map对象，以当前threadlocal对象的引用作为firstkey，存入firstvalue。

* ### 注意
>可以看到ThreadLocal.ThreadLocalMap的对象保存在线程对象中。
> ### 这意味着每一个线程对象都会有一份拷贝。但是这份拷贝如果是引用的话，那么对引用的对象的操作仍然会相互影响。
> ### 每个线程对象都对ThreadLocal.ThreadLocalMap的对象拥有强引用，自然也就对其中的value拥有强引用。这里容易引起内存泄漏。

* ### get()：
>返回此线程局部变量的当前线程副本中的值。


# ThreadLocal.ThreadLocalMap
> ### ThreadLocalMap中存放的就是Entry，Entry的KEY就是ThreadLocal，VALUE就是值。
