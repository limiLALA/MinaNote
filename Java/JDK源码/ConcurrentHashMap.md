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
3. 若是转发节点（哈希值是MOVED(-1)，转发节点的哈希），执行helpTransfer方法。如果正在进行扩容，先执行扩容；
5. 若是一条链表（哈希值是非负数），执行针对链表的插入操作。在第一个for循环内的最后，如果桶数目大于树化阈值，要进行树化操作；
6. 若是红黑树（哈希值小于-1），执行红黑树的插入操作；
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
            tab = helpTransfer(tab, f);//如果还在进行扩容操作就先扩容
        else {
            V oldVal = null;
            synchronized (f) {//用f对象加锁
                if (tabAt(tab, i) == f) {//再次检查i处得引用是否还是f
                    if (fh >= 0) {//首节点的哈希值是非负数，说明这里不是红黑树
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

### get
