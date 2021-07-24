# 版本 1.8

# 概要
* 遍历无序
* 线程不安全
* 允许key为null,value为null
* 其底层数据结构是数组称之为哈希桶，也就是 bucket。
* 每个桶里面放的是链表，链表中的每个节点，就是哈希表中的每个元素。
* 在JDK8中，当链表长度达到8，该链表会转化成红黑树，以提升它的查询、插入效率，当某链表长度小于等于6，又会转化为链表
* 查找哈希桶的下标使用的是hash函数，又称为扰动函数。
 (h = key.hashCode()) ^ (h >>> 16)  如果 key==null，就返回0
该函数的具体实现是 key的hashcode 异或 上hashcode>>16，然后与len-1 做与操作，事实上也就相当于对len取余数。
* 实现了Map<K,V>, Cloneable, Serializable接口。
* key的hash值，并不仅仅只是key对象的hashCode()方法的返回值，还会经过扰动函数的扰动，以使hash值更加均衡。

# 重要 attr
## TREEIFY_THRESHOLD
>TREEIFY_THRESHOLD = 8
某个链表的size大于等于这个值，就会触发树化，对这条链表进行树化

## UNTREEIFY_THRESHOLD
>UNTREEIFY_THRESHOLD = 6

## threshold
>当HashMap的容量达到threshold域值时，就会触发扩容。

## loadFactor
>bucket 的length 乘以 loadfactor 就是 threshold
## DEFAULT_LOAD_FACTOR
>默认的加载因子 0.75f;

## DEFAULT_INITIAL_CAPACITY
>默认的Map size

## MAXIMUM_CAPACITY
> 1<<30 //最大容量 2的30次方

## table
>哈希桶，存放链表。 长度是2的N次方，或者初始化时为0.
transient Node<K,V>[] table;

# 构造函数
```java
//同时指定初始化容量 以及 加载因子， 用的很少，一般不会修改loadFactor
  public HashMap(int initialCapacity, float loadFactor) {
      //边界处理
      if (initialCapacity < 0)
          throw new IllegalArgumentException("Illegal initial capacity: " + initialCapacity);
      //初始容量最大不能超过2的30次方
      if (initialCapacity > MAXIMUM_CAPACITY)
          initialCapacity = MAXIMUM_CAPACITY;
      //显然加载因子不能为负数
      if (loadFactor <= 0 || Float.isNaN(loadFactor))
          throw new IllegalArgumentException("Illegal load factor: " + loadFactor);
      this.loadFactor = loadFactor;
      //设置阈值为  》=初始化容量的 2的n次方的值
      this.threshold = tableSizeFor(initialCapacity);
  }
```
# 重要函数
## resize
> ### 这是 HashMap 的扩容函数
>首先分情况讨论

>### 当前bucket不为空
如果当前容量已经到达上限，那么设置阈值为2的31次方
然后返回当前的哈希桶，不再扩容
如果没有超上限，那么新的容量为旧的容量的两倍
然后新阈值也为旧阈值的两倍

>### 当前bucket为空
此时为lazy loading的初始化
如果有指定期望的cap，那么此时有阈值，那么容量会等于该阈值
然后在接下来的过程中乘以加载因子得到新阈值。
如果没有指定期望的cap，那么此时阈值为0， 那么新的容量为默认容量 1<<4
然后新的阈值由cap乘以加载因子获得。

>### 然后就是共同部分
根据新的容量，分配内存给新的哈希桶。
然后更新哈希桶的引用
如果旧桶不为空，那么拷贝旧桶数据

>### 对旧桶的每一个链表进行数据转移
首先分情况讨论
>>### 原桶为空
那么什么都不用做
>>### 原桶只有一个节点
将该节点的hash，也就是key的hashcode，对新的len进行取余操作，找到新的下标，然后将该节点放到新的下标处。
>>### 原桶有两个以上的节点
准备四个指针，两个指向扩容后下标不变的链表的表头和表尾，另外两个指向扩容之后下标改变的链表的表头和表尾。迭代整条链表，按照扩容后下标的不同分为两条链表。
链表的复制类似于普通的单链表的复制。
复制完毕，根据表尾指针分情况讨论
>>>### 表尾指针为空
那么不需要做什么
>>>### 表尾指针不为空、
那么将对应的表头指针放入扩容后的下标处。

## putVal
> 添加kv对
首先分情况讨论
>>### 如果当前哈希表是空的，比如在初始化的时候
那么直接扩容哈希表，并且将扩容后的哈希桶长度赋值给n
>>### 如果当前哈希表不为空
>>>### 当前的下标的节点为空
直接构建一个新节点Node，挂载在index处即可。
>>>### 当前下标的节点不为空
如果哈希值相等，key也相等，则是覆盖value操作，将引用赋值给value
否则就不是覆盖操作，要开始遍历这个冲突链表或者红黑树。
如果是红黑树那么调用另外的处理函数进行处理。
如果是链表，那么开始遍历这条链表，分两种情况
>>>>### 找到要覆盖的node
那么就把v的引用赋给value
然后返回旧的value
>>>>### 没找到要覆盖的node
那么就要在链表尾部追加一个新的node
如果追加完之后该链表的长度大于8，这里是去掉头节点的数目，那么就进行树化。
之后要将modCount加1，表示对结构的更改次数。
最后更新hashmap的大小，大于threshold则走resize

## remove(Object key)
```java
```
> 调用了removeNode 函数，
传入哈希桶数组下标，key，value
获取返回Node，如果有的话

## removeNode()
```java
```
> 


# 内部类
## Node
```java
static class Node<K,V> implements Map.Entry<K,V>{
  ...
  //每一个节点的hash值，是将key的hashCode 和 value的hashCode 亦或得到的。
  public final int hashCode() {
      return Objects.hashCode(key) ^ Objects.hashCode(value);
  }
  // 节点相等的条件是 1 地址一致 2 key value 均相等
  public final boolean equals(Object o) {
      if (o == this)
          return true;
      if (o instanceof Map.Entry) {
          Map.Entry<?,?> e = (Map.Entry<?,?>)o;
          if (Objects.equals(key, e.getKey()) &&
              Objects.equals(value, e.getValue()))
              return true;
      }
      return false;
  }

  // node的哈希函数
//每一个节点的hash值，是将key的hashCode 和 value的hashCode 亦或得到的。
  public final int hashCode() {
      return Objects.hashCode(key) ^ Objects.hashCode(value);
  }

  //其中
  // Objects.hashCode(key)
  // ==
  // key != null ? key.hashCode() : 0;
  ...
}
```

# 小结：
* ### 运算尽量都用位运算代替，更高效。
* ### 对于扩容导致需要新建数组存放更多元素时，除了要将老数组中的元素迁移过来，也记得将老数组中的引用置null，以便GC
* ### 取下标 是用 哈希值 与运算 （桶的长度-1） i = (n - 1) & hash。 由于桶的长度是2的n次方，这么做其实是等于 一个模运算。但是效率更高

# jdk8增加的
```java
public V putIfAbsent(K key, V value) {
      return putVal(hash(key), key, value, true, true);
}
//内部调用了
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,boolean evict)
//onlyIfAbsent=true
//若key对应的value之前存在，不会覆盖
```
```java
//以key为条件，找到了返回value。否则返回defaultValue
@Override
public V getOrDefault(Object key, V defaultValue) {
    Node<K,V> e;
    return (e = getNode(hash(key), key)) == null ? defaultValue : e.value;
}

```
