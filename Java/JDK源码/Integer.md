>Byte,Short,Integer,Long,Character这5种整型的包装类也只是在对应值小于等于127并且大于等于-128时才可使用常量池，因为他们至占用一个字节(-128~127);

Integer对象的方法
Integer.parseInt("");是将字符串类型转换为int的基础数据类型
Integer.valueOf("")是将字符串类型数据转换为Integer对象
Integer.intValue();是将Integer对象中的数据取出，返回一个基础数据类型int

```Java
public static Integer valueOf(int i) {
    assert IntegerCache.high >= 127;
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.***[i + (-IntegerCache.low)];
    return new Integer(i);
}
```
valueOf会将-128~127的Integer对象缓存起来，数值在该范围内的就直接返回缓存中的对象地址，否则new一个新的对象。

* 运行语句
```Java
Integer i = 128;
```
编译器会自动翻译成
```Java
Integer i = Integer.valueOf(128);
```
由于128不在IntegerCache中，所以又相当于
```Java
Integer i = new Integer(128);
```
