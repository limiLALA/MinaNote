# ConcurrentHashMap源码解析
### 初始化
通过sizeCtl+CAS实现线程安全的初始化/扩容操作。当有线程要执行初始化/扩容函数时，会用CAS将sizeCtl置为负数（初始化为-1，扩容为-(1+要执行扩容的线程数目)），保证同一时刻只有一个线程对table进行初始化/扩容操作。
```Java
private final Node<K,V>[] initTable() {
    Node<K,V>[] tab; int sc;
    while ((tab = table) == null || tab.length == 0) {
        if ((sc = sizeCtl) < 0)//当前有其他线程在执行初始化或者扩容函数
            Thread.yield(); // lost initialization race; just spin  让出CPU资源，从运行态转换成就绪态
        else if (U.compareAndSwapInt(this, SIZECTL, sc, -1)) {//用CAS将sizeCtl置为-1，如果失败，说明有其他线程修改了sizeCtl，需要重新取sizeCtl的值，从头来过；如果成功，就将sizeCtl置为-1，表明自己是最终负责初始化的线程
            try {//需要再次检查table是否空
                if ((tab = table) == null || tab.length == 0) {
                    //sc大于0，就取sc为容量；否则，默认容量为16
                    int n = (sc > 0) ? sc : DEFAULT_CAPACITY;
                    @SuppressWarnings("unchecked")
                    Node<K,V>[] nt = (Node<K,V>[])new Node<?,?>[n];
                    table = tab = nt;
                    sc = n - (n >>> 2);//0.75*n，作为扩容阈值
                }
            } finally {
              //try失败：table结构已经被其他线程修改过了，将sizeCtl改回来，初始化失败
              //try成功：将sizeCtl置为扩容阈值
                sizeCtl = sc;
            }
            break;
        }
    }
    return tab;
}
```
CAS语句```U.compareAndSwapInt(this, SIZECTL, sc, -1)```中的SIZECTL是一个常量，在类加载的时候被初始化为sizeCtl变量在对象中的偏移量，用于CAS寻址，从而方便执行硬件上的CAS操作。
```Java
U = sun.misc.Unsafe.getUnsafe();
Class<?> k = ConcurrentHashMap.class;
SIZECTL = U.objectFieldOffset
    (k.getDeclaredField("sizeCtl"));
```

### putVal
思路：
1. 若表空，先初始化；
2. 若要插入的位置为空桶，就用CAS添加新的键值对到空桶；
3. 若是转发节点（哈希值=MOVED(-1)，转发节点的哈希），执行helpTransfer方法。如果正在进行扩容，先执行扩容；
5. 若是一条链表（哈希值是非负数），执行针对链表的插入操作。在第一个for循环内的最后，如果桶数目大于树化阈值，要进行树化操作；
6. 若是红黑树（哈希值=TREEBIN(-2)），执行红黑树的插入操作；
7. 如果有旧值，就返回旧值；否则，添加哈希表的元素数目，检查是否达到扩容条件，最后返回null。
```Java
/*
实现put和putOnlyIfAbsent
onlyIfAbsent: true表示只有在没有这个key时才put，否则不替换；false表示进行替换
*/
final V putVal(K key, V value, boolean onlyIfAbsent) {
    if (key == null || value == null) throw new NullPointerException();//空指针异常
    int hash = spread(key.hashCode());//发散键的哈希值（高低16位进行异或），充分利用所有32位的特征
    int binCount = 0;//桶数量
    for (Node<K,V>[] tab = table;;) {//如果put失败就一直尝试
        Node<K,V> f; int n, i, fh;
        if (tab == null || (n = tab.length) == 0)//表空
            tab = initTable();//先初始化表
        else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {//对应位置为空桶
            if (casTabAt(tab, i, null,
                         new Node<K,V>(hash, key, value, null)))//用CAS插入新节点
                break;                   // no lock when adding to empty bin //添加到空桶中时，不用锁。如果CAS失败就从头再来
        }
        else if ((fh = f.hash) == MOVED)//转发节点的哈希
            tab = helpTransfer(tab, f);//如果还在进行扩容操作就加入一起扩容
        else {
            V oldVal = null;
            synchronized (f) {//用f对象加锁
                if (tabAt(tab, i) == f) {//再次用volatile读 检查i处的引用是否还是f
                    if (fh >= 0) {//首节点的哈希值是非负数，说明这里不是红黑树等特殊节点
                        binCount = 1;//头结点是一个非空桶，桶数目加一
                        for (Node<K,V> e = f;; ++binCount) {//遍历链表
                            K ek;
                            if (e.hash == hash &&
                                ((ek = e.key) == key ||
                                 (ek != null && key.equals(ek)))) {//找到key相同的节点
                                oldVal = e.val;//保存旧值
                                if (!onlyIfAbsent)//如果是替换策略
                                    e.val = value;//替换为新值
                                break;//put结束，退出链表的遍历
                            }
                            Node<K,V> pred = e;//前置节点
                            if ((e = e.next) == null) {//尾节点
                                pred.next = new Node<K,V>(hash, key,
                                                          value, null);//创建新节点，插入尾部
                                break;//put结束，退出链表的遍历
                            }
                        }
                    }
                    else if (f instanceof TreeBin) {//是红黑树
                        Node<K,V> p;
                        binCount = 2;//桶数目为2
                        if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key,
                                                       value)) != null) {//调用红黑树的插入API，如果已经存在这个key，就返回对应的引用；否则插入新节点，并返回null
                            oldVal = p.val;
                            if (!onlyIfAbsent)
                                p.val = value;
                        }
                    }
                }
            }
            if (binCount != 0) {//不是空桶
                if (binCount >= TREEIFY_THRESHOLD)//大于树化阈值
                    treeifyBin(tab, i);//将i处的链表转化为红黑树
                if (oldVal != null)//存在旧值，返回旧值
                    return oldVal;
                break;
            }
        }
    }
    //插入的是新节点（没有旧值）
    addCount(1L, binCount);//使用LongAdder机制，哈希表元素数目加一，如果达到扩容阈值，就进行扩容
    return null;
}
```
```Java
casTabAt(tab, i, null, new Node<K,V>(hash, key, value, null));
casTabAt(Node<K,V>[] tab, int i, Node<K,V> c, Node<K,V> v);
static final <K,V> boolean casTabAt(Node<K,V>[] tab, int i,
                                    Node<K,V> c, Node<K,V> v) {
    return U.compareAndSwapObject(tab, ((long)i << ASHIFT) + ABASE, c, v);
}
```
### get
get操作是无锁的，但是实现了多线程下的数据可见性：
1. value的volatile声明保证值的可见性
2. next的volatile声明保住next引用的可见性
3. tabAt方法使用本地方法的volatile读获取Object
```Java
/**
 * 返回key映射的value，如果不存在key的映射，返回null
 * 如果存在这样的k，有key.equals(k)，返回k映射的v。
 * 最多只能有一个这样的映射
 *
 * @throws NullPointerException if the specified key is null
 * 参数key为null，抛出空指针异常
 */
public V get(Object key) {
    Node<K,V>[] tab; Node<K,V> e, p; int n, eh; K ek;
    int h = spread(key.hashCode());//扩散键的hash
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (e = tabAt(tab, (n - 1) & h)) != null) {//表不空 and 通过tabAt的volatile读得到非空桶
        if ((eh = e.hash) == h) {//哈希值相同，说明该位置是一个有效Node
            if ((ek = e.key) == key || (ek != null && key.equals(ek)))//key相同
                return e.val;
        }
        else if (eh < 0)//转发节点(-1)/红黑树(-2)/暂存节点(-3)
            return (p = e.find(h, key)) != null ? p.val : null;//调用对应子类(ForwardingNode/TreeNode/ReservationNode)重写的父类(Node)的find()
        while ((e = e.next) != null) {//遍历链表
            if (e.hash == h &&
                ((ek = e.key) == key || (ek != null && key.equals(ek))))
                return e.val;
        }
    }
    return null;
}
```
```Java
/**
 * Key-value entry.  This class is never exported out as a
 * user-mutable Map.Entry (i.e., one supporting setValue; see
 * MapEntry below), but can be used for read-only traversals used
 * in bulk tasks.  Subclasses of Node with a negative hash field
 * are special, and contain null keys and values (but are never
 * exported).  Otherwise, keys and vals are never null.
 * 键值项。hash和key都是不可变的，只有value和next可变.
 * 如果hash是负数，说明这是一个特殊的节点，key和value可为空；其他情况均不允许为null。
 */
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    volatile V val;
    volatile Node<K,V> next;

    Node(int hash, K key, V val, Node<K,V> next) {
        this.hash = hash;
        this.key = key;
        this.val = val;
        this.next = next;
    }

    public final K getKey()       { return key; }
    public final V getValue()     { return val; }
    public final int hashCode()   { return key.hashCode() ^ val.hashCode(); }
    public final String toString(){ return key + "=" + val; }
    public final V setValue(V value) {
        throw new UnsupportedOperationException();
    }

    public final boolean equals(Object o) {
        Object k, v, u; Map.Entry<?,?> e;
        return ((o instanceof Map.Entry) &&
                (k = (e = (Map.Entry<?,?>)o).getKey()) != null &&
                (v = e.getValue()) != null &&
                (k == key || k.equals(key)) &&
                (v == (u = val) || v.equals(u)));
    }

    /**
     * Virtualized support for map.get(); overridden in subclasses.
     * 为get方法提供支持；该方法在子类(如TreeNode)中会被重写
     */
    Node<K,V> find(int h, Object k) {//为链表类型写的find
        Node<K,V> e = this;
        if (k != null) {
            do {
                K ek;
                if (e.hash == h &&
                    ((ek = e.key) == k || (ek != null && k.equals(ek))))
                    return e;
            } while ((e = e.next) != null);
        }
        return null;
    }
}
```
##### 桶对象的物理定位
哈希桶数组对象的首地址：tab；
桶元素的偏移量：```((long)i << ASHIFT) + ABASE```。
>在64位系统中，每个地址都是64位的数值，因此要把i强制转换为long型。
ABASE是哈希桶数组对象的对象头所占内存空间大小。
pow(2, ASHIFT)表示每个桶元素所占内存空间的大小，左移相当于乘以pow(2, ASHIFT)

```Java
Class<?> ak = Node[].class;//哈希桶数组类
ABASE = U.arrayBaseOffset(ak);//真正的数组基址相对于Node[]数组对象首地址的物理偏移量（即堆中数组对象头的大小）
int scale = U.arrayIndexScale(ak);//数组中相邻索引元素间的物理间隔（一个Node引用所占的内存大小）
if ((scale & (scale - 1)) != 0)//大小必须是2的幂次，直接用移位操作即可获取指定索引处的物理地址，提高寻址效率
    throw new Error("data type scale not a power of two");
//numberOfLeadingZeros获取到scale从高位开始连续位为0的个数
ASHIFT = 31 - Integer.numberOfLeadingZeros(scale);//实则就是得到log2(scale)
```
###### tabAt的实现
```Java
static final <K,V> Node<K,V> tabAt(Node<K,V>[] tab, int i) {//得到对应对象的引用
    return (Node<K,V>)U.getObjectVolatile(tab, ((long)i << ASHIFT) + ABASE);
}
```
