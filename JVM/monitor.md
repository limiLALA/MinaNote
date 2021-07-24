# 概述
* ### 每一个java对象都自带一个monitor对象，该对象可以是Object类型的，也可以是Class类型的。
* ### java中的syncrhoized又叫做内置锁，是通过monitor对象的取用和释放方法来实现锁功能的。
* ### Monitor是内置于任何一个对象中的，syncrhoized利用monitor来实现加锁解锁，故syncrhoized又叫做内置锁。
* ### 一个对象的monitor是唯一的
* ### 锁标记存在于monitor对象头的markword中

# 对象头包括内容
* ### markword
* ### 指向类信息的指针
* ### 如果是数组对象，数组的length

# 例子
# synchronized代码块
现在假设有代码块：  
```java
syncrhoized（Object lock）{
         同步代码...;
}
```

它在字节码文件中被编译为：
```asm
monitorenter;//获取monitor许可证，进入同步块
同步代码...
monitorexit;//离开同步块后，释放monitor许可证
```

# synchronized方法
```java
public synchronized void method1(){
   System.out.println("Hello World!");
   }
```
它在字节码文件中被编译为：
```asm
...
public synchronized void method1();
flags:
code:ACC_PUBLIC, ACC_SYNCHRONIZED
...
```
