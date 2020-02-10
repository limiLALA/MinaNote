# HashTable源码解析
##### 与HashMap不同的地方
* HashTable的容量可以是任意的，与此同时发生变化的就是获取key的Index的方式变为对容量取余。
* HashTable没有使用懒加载，构造函数中就初始化好了table。
* HashTable对put实现了线程安全。

---------------------------------------------
### 构造函数
```Java
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
public Hashtable(int initialCapacity) {
    this(initialCapacity, 0.75f);
}
public Hashtable() {
    this(11, 0.75f);
}
public Hashtable(Map<? extends K, ? extends V> t) {
    this(Math.max(2*t.size(), 11), 0.75f);
    putAll(t);
}
```

---------------------------------------------
### put
##### 线程安全的哈希表
此方法使用synchronized关键字进行修饰，即成为一个线程安全的方法。

当执行者执行到这个put方法时，会尝试去拿到这个HashTable对象this的monitor锁

```Java
public synchronized V put(K key, V value) {
    // Make sure the value is not null
    if (value == null) {
        throw new NullPointerException();
    }

    // Makes sure the key is not already in the hashtable.
    Entry<?,?> tab[] = table;
    int hash = key.hashCode();
    int index = (hash & 0x7FFFFFFF) % tab.length;//保证这是个正数，然后采用余数法进行哈希
    @SuppressWarnings("unchecked")
    Entry<K,V> entry = (Entry<K,V>)tab[index];
    for(; entry != null ; entry = entry.next) {//遍历index下的链表（如果有的话），看下key是否已经存在于哈希表中
        if ((entry.hash == hash) && entry.key.equals(key)) {
            V old = entry.value;
            entry.value = value;
            return old;
        }
    }

    addEntry(hash, key, value, index);
    return null;
}
private void addEntry(int hash, K key, V value, int index) {
    modCount++;

    Entry<?,?> tab[] = table;
    if (count >= threshold) {
        // Rehash the table if the threshold is exceeded
        rehash();

        tab = table;//重定向到扩容后的新哈希表
        hash = key.hashCode();//重新计算哈希值
        index = (hash & 0x7FFFFFFF) % tab.length;//用扩容后的新长度计算索引
    }

    // Creates the new entry.
    @SuppressWarnings("unchecked")
    Entry<K,V> e = (Entry<K,V>) tab[index];
    tab[index] = new Entry<>(hash, key, value, e);//在表头插入新节点
    count++;//已放入的Entry数目自增
}
```

---------------------------------------------
### getOrDefault

---------------------------------------------
### get

---------------------------------------------
### resize
