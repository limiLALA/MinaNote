>面试常问：HashMap与ConcurrentHashMap
* HashMap与HashTable的hash函数不同
* HashMap使用取与方式获取索引，效率更高，但是要注意长度对齐问题；HashTable使用取余数方式。

# HashMap源码解析
```Java
public class HashMap<K,V> extends AbstractMap<K,V>
    implements Map<K,V>, Cloneable, Serializable {

}
```
----------------------------------------------
##### HashMap的底层实现
JDK 1.8中的HashMap是底层实现就是一个Node<K, V>[]数组。
```Java
transient Node<K,V>[] table;
```

HashMap的使用
```Java
HashMap<String, String> map =  new HashMap<String, String>();
map.put( "张三"， "测试数据" );
map.put( "李四"， "测试数据" );
```

上述代码最终存储形式大致如下所示：
```Java
[<>,<>,<>,<>,<"张三","测试数据">,<"李四","测试数据">,<>,<>,<>,<>,<>,<>]
```
这里假设数组长度为16。

---------------------------------------------
### 构造函数
采用懒加载机制，构造函数中不会初始化所有实例变量，只会在用到的时候才初始化，比如table，threshold
```Java
public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " +
                                           initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " +
                                           loadFactor);
    this.loadFactor = loadFactor;//加载因子:当装载长度大于容量threshold*loadFactor时，自动扩容为原来的2倍
    this.threshold = tableSizeFor(initialCapacity);//实际容量要对齐为2的幂次
}
public HashMap(int initialCapacity) {
    this(initialCapacity, DEFAULT_LOAD_FACTOR);//调用上面的构造函数
}
public HashMap() {//未初始化threshold，在put的时候再初始化
    this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
}
public HashMap(Map<? extends K, ? extends V> m) {//直接用Map去初始化table
    this.loadFactor = DEFAULT_LOAD_FACTOR;
    putMapEntries(m, false);
}
```
---------------------------------------------
### hash函数
```Java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```
h共32位，为key的哈希码，将h高16位与低16位进行异或后的结果，作为最终的哈希值返回，目的是充分利用32位的所有特征，减少哈希冲突。  
由于常用的哈希表长度n一般不会超过pow(2, 16)，故返回的哈希值只有低16位有作用(hash & (n - 1))，如果有两个不同的key，但是他们的哈希码的低16位完全一样，只有高16位有区别，如果不进行异或操作而是直接返回哈希码，就会发生哈希冲突。
---------------------------------------------
### put
```Java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;//定义一个新的table引用而不直接使用table进行操作的目的：如果直接使用this.table，其访问过程会经历通过this引用找到对象再堆中的位置，然后再找到table的位置这2个过程；如果使用局部变量tab，则会将table的地址放在局部变量表中，使用tab进行访问就直接访问table的位置即可，节省开销。
    if ((tab = table) == null || (n = tab.length) == 0)//哈希表为空
        n = (tab = resize()).length;//扩容
    if ((p = tab[i = (n - 1) & hash]) == null)//目标位置为空
        tab[i] = newNode(hash, key, value, null);//new一个新节点放入
    else {//目标位置不空，发生哈希冲突
        Node<K,V> e; K k;
        if (p.hash == hash &&//key相同，最后用新value覆盖旧value
            ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
        else if (p instanceof TreeNode)//该位置是一棵红黑树
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);//调用红黑树的插入算法
        else {//该位置是链表
            for (int binCount = 0; ; ++binCount) {
                if ((e = p.next) == null) {//遍历到表尾
                    p.next = newNode(hash, key, value, null);//将新的<K, V>对插入到表尾
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);//如果链表长度过长，就转化为红黑树
                    break;
                }
                if (e.hash == hash &&//key相同，最后用新value覆盖旧value
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                p = e;//指向下一个节点
            }
        }
        if (e != null) { // existing mapping for key 已经存在这个key，用新value覆盖旧value
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    ++modCount;//哈希表修改次数
    if (++size > threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
}
```
##### 寻址算法的优化
>位运算的效率高于算术运算的效率

HashMap使用的是与形如 *(n - 1) & hash* 的与运算，效率比 *hash % n* 高，并且结果是等价的。

这样优化的前提是数组长度n为2的幂次方。

##### 哈希碰撞的处理
**链表+红黑树 O(n) O(logn)**

假设在array[4]处发生哈希冲突，则在array[4]处存储的就是一条链表的表头，链表上挂着发生哈希冲突的键值对。

当链表的长度大于某个值时，就会转换成红黑树，查找效率为O(logn)。

-------------------------------------------------
### get
##### HashMap的查找
在进行如下查找时，会先计算"张三"的HashCode，然后对哈希值进行某种优化，再对数组长度取模，即得到对应数据的索引。比如这里的索引是4，于是get这个函数会返回array[4]。
```Java
map.get("张三")
```

```Java
public V get(Object key) {
    Node<K,V> e;
    return (e = getNode(hash(key), key)) == null ? null : e.value;
}
final Node<K,V> getNode(int hash, Object key) {
    Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (first = tab[(n - 1) & hash]) != null) {
        if (first.hash == hash && // always check first node
            ((k = first.key) == key || (key != null && key.equals(k))))
            return first;
        if ((e = first.next) != null) {//如果有哈希冲突
            if (first instanceof TreeNode)//如果是红黑树的根节点
                return ((TreeNode<K,V>)first).getTreeNode(hash, key);//调用红黑树的查找算法
            do {//如果是链表
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    return e;
            } while ((e = e.next) != null);
        }
    }
    return null;
}
```

----------------------------------------------------
### resize
##### 哈希表的扩容
**翻倍扩容**

假设原来的数组长度为16，触发扩容条件时，会将容量扩充至32，此时要进行rehash。

rehash的过程：对每一个哈希值，和16进行与运算(仅检查二进制数中可能有变化的那一位)，如果结果和原来不同，说明要搬家，新家的索引值就是(原来的索引值 + 16)。

对应到源码，原来的索引即 *j* ，旧哈希表容量为oldCap。

```Java
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    int oldThr = threshold;
    int newCap, newThr = 0;
    if (oldCap > 0) {//旧表不空
        if (oldCap >= MAXIMUM_CAPACITY) {
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                 oldCap >= DEFAULT_INITIAL_CAPACITY)
            newThr = oldThr << 1; // double threshold
    }
    else if (oldThr > 0) // initial capacity was placed in threshold 哈希表为空，尚未插入过键值对，此时初始Capacity存在threshold中
        newCap = oldThr;
    else {               // zero initial threshold signifies using defaults 构造函数中没有给定初始Capacity，使用默认Capacity
        newCap = DEFAULT_INITIAL_CAPACITY;
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }
    if (newThr == 0) {//对应上面第二个条件分支
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);//如果初始Capacity给的太大，就将整型数据的最大值作为哈希表的最大长度
    }
    threshold = newThr;
    @SuppressWarnings({"rawtypes","unchecked"})
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;
    if (oldTab != null) {
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
                oldTab[j] = null;
                if (e.next == null)
                    newTab[e.hash & (newCap - 1)] = e;
                else if (e instanceof TreeNode)
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                else { // preserve order
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    do {
                        next = e.next;
                        //仅检查扩容后的这一位即可
                        if ((e.hash & oldCap) == 0) {//无变化，留在原来的位置
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        else {//有变化，需要迁移到新哈希表中的新位置
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    if (loTail != null) {//老位置：j
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    if (hiTail != null) {//新位置：j + oldCap
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab;
}
```

### remove
removeNode中，如果成功移除对应的Node，就将modCount++。
```Java
public V remove(Object key) {
    Node<K,V> e;
    return (e = removeNode(hash(key), key, null, false, true)) == null ?
        null : e.value;
}
```
