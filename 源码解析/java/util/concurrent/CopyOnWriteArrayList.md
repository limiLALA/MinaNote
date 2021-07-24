# 版本
# 概述
* ### 实现了list接口，说明是元素可重复的，而且元素是有索引的。
> list实现了iterable，可以通过迭代器进行遍历。
list实现了collection 说明是一组元素的集合。而不是kv键值对。

* ### 实现了RandomAccess接口，可以按照索引进行随机访问的。

* ### 使用 **ReentrantLock重入锁** 加锁，保证线程安全；
* ### 采用读写分离的思想
>读操作不加锁，写操作加锁，且写操作占用较大内存空间，所以适用于读多写少的场合；

* ### 只保证最终一致性，不保证实时一致性；
* ### 数组的长度就是集合的大小，而不像ArrayList ***数组的长度大于元素数量***。

# 重要 Attr
## Object[] array
```java
private transient volatile Object[] array;
```
> ### 真正存储元素的地方。
只能听过getArray（） 和 setArray（） 访问。

## ReentrantLock lock
```java
final transient ReentrantLock lock = new ReentrantLock();
```
> 用于修改时加锁，使用transient修饰表示不自动序列化。


# 构造方法
## CopyOnWriteArrayList()
> ### 默认是创建一个空的Object数组

```java
public CopyOnWriteArrayList() {
    // 所有对array的操作都是通过setArray()和getArray()进行
    setArray(new Object[0]);
}

final void setArray(Object[] a) {
    array = a;
}
```


## CopyOnWriteArrayList(Collection c)
> ### 按照Collection c分类讨论
>> ### 如果c是CopyOnWriteArrayList类型
直接把它的数组赋值给当前list的数组，注意这里是 **浅拷贝**，两个集合共用同一个数组。
>> ### 如果c不是CopyOnWriteArrayList类型
调用其toArray()方法将集合元素转化为数组
```java
public CopyOnWriteArrayList(Collection c) {
  Object[] elements;
  if (c.getClass() == CopyOnWriteArrayList.class)
  // 如果c也是CopyOnWriteArrayList类型
  // 那么直接把它的数组拿过来使用
  elements = ((CopyOnWriteArrayList)c).getArray();
  else {
      // 否则调用其toArray()方法将集合元素转化为数组
      elements = c.toArray();
      // 这里c.toArray()返回的不一定是Object[]类型
      // 详细原因见ArrayList里面的分析
      if (elements.getClass() != Object[].class)
          elements = Arrays.copyOf(elements, elements.length, Object[].class);
  }
  setArray(elements);
}
```


## CopyOnWriteArrayList(E[] toCopyIn)
>
```java
public CopyOnWriteArrayList(E[] toCopyIn) {
    setArray(Arrays.copyOf(toCopyIn, toCopyIn.length, Object[].class));
}
```
> ### 把toCopyIn的元素拷贝给当前list的数组。



# 重要方法
## getArray

## setArray(Object[] a)
```java

```
>

## add(E e)
>首先先加锁
然后获取旧数组
生成一个新数组，拷贝原数组数据，然后在新数组上做写操作
然后把新数组设为 array
最后解锁
```java
public boolean add(E e) {
    final ReentrantLock lock = this.lock;
    // 加锁
    lock.lock();
    try {
        // 获取旧数组
        Object[] elements = getArray();
        int len = elements.length;
        // 将旧数组元素拷贝到新数组中
        // 新数组大小是旧数组大小加1
        Object[] newElements = Arrays.copyOf(elements, len + 1);
        // 将元素放在最后一位
        newElements[len] = e;
        setArray(newElements);
        return true;
    } finally {
        // 释放锁
        lock.unlock();
    }
}
```

## add(int index, E element)
>用于在任意位置插入元素
这个方法与普通add有两个差别
1 是做了下标的检查
2 对原数组的复制分为两个部分进行，分别是[0.index) (index, len)
这样index正好空出来
直接把element放在index处即可。
然后修改array引用指向

## addIfAbsent(E e)
>添加一个元素如果这个元素不存在于集合中。
在这里进行第一次通过确认元素是否已经存在，通过indexOf函数进行确认
>> ### 如果已经存在，那么直接返回false
>> ### 如果不存在
那么调用getArray获取此时的array，然后走addIfAbsent(E e, Object[] snapshot)，传入此刻的array

##  addIfAbsent(E e, Object[] snapshot)
>首先加锁
然后根据传入的snapshot与当前getarray获取的array进行比对
如果不同，说明有别的线程修改过，则需要进行二次确认此刻元素是否已经存在。
之后再执行类似于add函数的操作，拷贝数组然后重新指向。

## get(int index)
>支持随机访问，时间复杂度 O（1）
* ### 获取元素不需要加锁
* ### 不做越界检查
```java
public E get(int index) {
    // 获取元素不需要加锁
    // 直接返回index位置的元素
    // 这里是没有做越界检查的, 因为数组本身会做越界检查
    return get(getArray(), index);
}
final Object[] getArray() {
    return array;
}
private E get(Object[] a, int index) {
    return (E) a[index];
}
```

# 重要内部类
## COWSubList
```java
private static class COWSubList<E>
        extends AbstractList<E>
        implements RandomAccess
    {
    }
```
