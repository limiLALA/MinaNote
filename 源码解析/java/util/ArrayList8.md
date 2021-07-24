# 版本 1.8
# 概要
* ### ArrayList 是一个动态数组，它是线程不安全的，允许元素为null
* ### 它是占据一块连续的内存空间（容量就是数组的length），所以它也有数组的缺点，空间效率不高
* ### 可以根据下标以O1的时间读写(改查)元素，因此时间效率很高。
* ### 当集合中的元素超出这个容量，便会进行扩容操作。扩容比较号是，因此我们要根据具体应用场景设置合理的初始长度，避免过于频繁的扩容操作。减少扩容次数，提高效率。
* ### 每次修改结构时，增加导致扩容，或者删，都会修改modCount。

# attribute
* DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
>**private static final** Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {}; //默认构造函数里的空数组

* elementData
>transient Object[] elementData; //存储集合元素的底层实现：真正存放元素的数组

# 构造方法
>这里分两种情况讨论
>>### 没有指定初始容量
那么按照默认的来
>>### 指定了初始容量
