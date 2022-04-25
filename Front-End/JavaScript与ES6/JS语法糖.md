# ...的作用
类似于C中的**，是一个展开语法（Spread Syntax），在函数调用/数组构造时，将数组表达式或string在语法层面展开。还可在构造字面量对象时，将对象表达式按key:value形式展开。  
注：字面量一般是指[1,2,3]或{key:"value"}这种简洁的构造方式。

### 函数传参
##### 作为实参
```js
function sum(a,b,c){
  return a+b+c;
}
let arr=[1,2,3];
console.log(sum(...arr));
```
最后打印出
```js
6
```
##### 作为形参
```js
function acceptArgs(x,...args){
  console.log(x);
  console.log(args);
}
acceptArgs(1,2,3,4,5);
```
最后打印出
```js
1
[2,3,4,5]
```

### 深拷贝对象
```js
let obj1={
  name:"Jack",
  age:20
};
let obj2={...obj1};
obj2.name="Bob";//不会改变obj1
console.log(obj1,obj2);
```

### 数组复制
```js
let arr1=[1,2,3];
let arr2=[...arr1];
arr2[2]=6;//不会改变arr1
console.log(arr1,arr2);
```

### 数组中对象复制
如果数组中是对象，就没法通过...来进行深拷贝了。...只会将数组中的对象的引用拷贝出来。需要自己写递归来深拷贝。

# JS中的&&和||

### 概述

javascript中，&&和||的用法比较神奇，经常用在对象上，例如a || b，如果a不存在，则返回b。a && b，如果a存在，则返回b，否则返回a。

&& 和 || 的作用只有一个：进行布尔值的且和或的运算。**当运算到某一个变量就得出最终结果之后，就返回哪个变量。**

在javascript中，这些内容会被当成false处理：**"" , false , 0 , null , undefined , NaN**。其他都是true。
注意：字符串"false"也会被当做true处理，在未转型的情况下他是字符串，属于一个对象，所以是true。

### 结论

**a || b：**如果a是true，那么b不管是true还是false，都返回true。因此不用判断b了，这个时候刚好判断到a，因此返回a。

　　　如果a是false，那么就要判断b，如果b是true，那么返回true，如果b是false，返回false，其实不就是返回b了吗。

**a && b：**如果a是false，那么b不管是true还是false，都返回false，因此不用判断b了，这个时候刚好判断到a，因此返回a。

　　　如果a是true，那么就要再判断b，和刚刚一样，不管b是true是false，都返回b。

| a\|\|b运算返回值：下面为a的值\右边为b的值 | true | false |
| ----------------------------------------- | ---- | ----- |
| true                                      | a    | a     |
| false                                     | b    | b     |

| a&&b运算返回值：下面为a的值\右边为b的值 | true | false |
| --------------------------------------- | ---- | ----- |
| true                                    | b    | b     |
| false                                   | a    | a     |

### 实例

```js
var a=new Object(),b=0,c=Number.NaN,d=1,e="Hello"; 
alert(a || b && c || d && e); 
```

注：表达式从左往右执行，先&&后||

**1、(b && c)：**b是false，此时不需要判断c，因为不管c是true是false，最终结果一定是false，因此返回当前判断对象b，也就是0；

**2、(d && e)：**d是true，这个时候判断e，此时不管e是true，是false，返回结果一定是e，e为true，因此返回"Hello"；

**3、(a || b)：**a是true，此时不管b是true是false，结果都是true，所以不判断b，所以返回当前判断对象a，因此返回new Object()；

**4、(a || e)：**同上，因此返回a。

这个表达式最终结果为a，也就是new Object()。

