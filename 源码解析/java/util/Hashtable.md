# 版本 1.8
# 概述
* ### HashTable是线程安全的，且不允许key、value是null。
* ### HashTable默认容量是11，默认加载因子为0.75f
* ### HashTable是直接使用key.hashCode()作为hash值
>不像HashMap内部使用扰动函数 key.hashCode()>>16^key.hashCode()

* ### 在获取哈希桶的下标的时候，采用的是分号取余法
>没有规定哈希桶array的长度一定为2的n次方，因此也没有使用掩码的方法，也就是与的方法

* ### 先扩容后增加entry
>Hashmap 是先增加entry然后再走扩容

# 构造函数
```java
public Hashtable(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal Capacity: "+
                                           initialCapacity);
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal Load: "+loadFactor);

    if (initialCapacity==0)
        initialCapacity = 1;
    this.loadFactor = loadFactor;
    table = new Entry<?,?>[initialCapacity];
    threshold = (int)Math.min(initialCapacity * loadFactor, MAX_ARRAY_SIZE + 1);
}
```
> 如果传入了初始容量就直接分配内存空间，按照给的数字来分配
阈值直接通过 容量乘以加载因子获得。

# 重要函数
## rehash
> ### 这是hashtable的扩容函数
首先获得扩容后的容量，该容量为原容量的两倍。然后分情况讨论
>> ### 新容量大于最大值
>>> ### 如果旧容量已经是最大值
那么直接返回
>>> ### 如果旧容量小于最大值
那么新容量等于最大值
>> ### 新容量不大于最大值
> ### 然后就是共同的部分
为新的table分配内存，将原table指向新table，原table旧可以被GC
遍历原来的每一个桶，获取头节点
遍历这张表，通过先转为正数然后分号取余的方式，获取新表的下标，然后采取头插法进行搬运。

## addEntry
> ### 用于增加一个entry
首先获取当前的size，然后分情况讨论
>> ### size 对于等于 阈值
那么走rehash，然后改变hashtable对象种table的指向，同时更新要插入的桶的下标
>> ### size 小于阈值
那么走共同的部分
调用典型的头插法 新建节点函数
```java
tab[index] = new Entry<>(hash, key, value, e);
```
最后修改modCount+=1

## get
> 同步方法 public synchronized V get(Object key)

## put
> 同步方法 public synchronized V put(K key, V value)

# 扩容
##
