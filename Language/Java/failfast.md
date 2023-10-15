
## 并发修改
当一个线程在遍历一个Collection时，另一个线程修改了这个Collection的内容，就是并发修改。

## fail-fast
使用迭代器iterator进行Collection的遍历时，会检查创建迭代器时缓存的expectedModCount是否等于modCount，如果不同，就会抛出ConcurrentModificationException异常，即failfast。
#### 触发场景
###### 单线程
使用迭代器遍历，同时用Collection.add()或Collection.remove()，会修改modCount，与expectedModCount不一致，导致failfast。

###### 多线程
一个线程使用迭代器遍历Collection，另一个线程使用Collection.add()或Collection.remove()对其进行修改，也会导致failfast。

#### 如何避免failfast
当使用迭代器遍历时，如果要修改Collection，使用迭代器的iterator.add()或iterator.remove()。

## fail-safe
CopyOnWrite写时复制
https://blog.csdn.net/ch717828/article/details/46892051
