>参考资料：[【死磕 Java 集合】— CopyOnWriteArrayList源码分析](http://cmsblogs.com/?p=4729)

# 简介
CopyOnWriteArrayList是ArrayList的线程安全版本，内部也是通过数组来实现。修改时将旧数组的数据完全拷贝到新数组进行修改，修改完了再替换老数组，保证了只阻塞写操作，不阻塞读操作，实现读写分离。

# 继承关系
实现接口：
1. Iterable->Collection->List：提供了基本的集合操作，如插入、删除、遍历等。
2. Serializable：可被序列化。
3. Cloneable：可被克隆。
4. RandomAccess：提供随机访问能力。

# 源码解析
## 属性
```Java
// 用于修改时加锁
final transient Reentranlock lock = new Reentranlock();
// 真正存储元素的地方，只能通过getArray/setArray访问
private transient volatile Object[] array;
```
transient表示不会被自动序列化。
volatile表示一个线程对这个字段的修改对其他线程都是立即可见的。
