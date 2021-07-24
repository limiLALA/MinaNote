# 版本
# 概述
* ### Buffer 是一个用于特定基本数据类型的容器。
除boolean以外。
* ### 在Buffer中有两种模式
一种是写模式，一种是读模式。通过调用flip方法切换。
* ### Buffer为抽象类
具体使用其对各种类型的实现类

# 重要attr
## capacity
表示Buffer容量的大小。

## limit
可以操作的长度

## position
已经操作过的长度
同时也是下一个要读取或写入的元素的下标
**缓冲区的位置不能为负数，并且不能大于其限制。**

## mark

## 注意
**mark <= position <= limit <= capacity**

# 构造方法
> ### 由于Buffer为抽象类，因此它的构造方法为子类构造方法所使用。并初始化各个实现类的共同部分。

## Buffer(int mark, int pos, int lim, int cap)
将capacity 设置为 cap
然后将 limit设置为lim
设置position
设置mark



# 重要方法
## limit(int newLimit)
> ### limit必须满足这样的关系：0<=limit<=position.
>首先有效性检查，即limit必须满足这样的关系：0<=limit<=position.
```java
limit = newLimit;
```
>如果position大于newLimit，则将position设置为新的limit。
```java
position = limit;
```
>如果mark被定义且大于新的limit，则会被抛弃(即设置为-1)
```java
mark = -1;
```


## position(int newPosition)
> ### 设置Buffer的position.如果mark被定义且大于new position，则就会被设置为-1。
> 首先有效性检查，即0<=newPosition<=limit.
```java
position = newPosition;
```
>如果mark被定义且大于new position，则设置为-1
```java
mark = -1;
```





# 重要内部类
