>###### 完整教程  
[ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/intro)  
[JavaScript 教程](https://wangdoc.com/javascript/)

# JS语法
## let、var与const
### 作用域
全局作用域、函数作用域、eval作用域。  
eval只有在被直接调用的时候，this指向才是当前作用域，否则是全局作用域。下面的(1,eval)是个表达式，不是eval的引用，等价于(1&&eval)或者(true&&eval)或者(0?0:eval)
```js
var a='outer';
(function(){
  var a='inner';
  eval('console.log("直接调用："+a)');//结果打印出inner
  (1,eval)('console.log("间接调用："+a)');//结果打印出outer
})();
```
### var
var声明的变量等价于没有关键字声明直接赋值的变量，如果是windows环境，则变量会直接挂到window下，
```js
a=1;
var a=1;
if(window.location.href===location.href)//true
if(window.a===a)//true
```
### 不同关键字声明的变量作用域
let只作用在当前块级作用域中，var作用于全局/函数作用域
```js
for(let i=0;i<10;i++){}
console.log(i);//报错
for(var i=0;i<10;i++){}
console.log(i)//11
```
使用let或const声明的变量，不能再被重新声明，而var可以
```js
let a=0;
const b=1;
var c=2;
let a=3;//报错
const b=4;//报错
var c=5;//重新赋值
```
let不存在变量提升，而var有。var声明的变量会被编译器提到最开始的时候进行初始化。
```js
console.log(v);//正常打印
var v='我是var';
console.log(l);//报错说不存在这个变量
let l='我是let';
```
暂存死区。编译器会找到每个作用域下的所有被声明的变量，cute同时被全局和块级作用域声明时，执行块级作用域下的console语句会优先找最近的变量，但是cute没有变量提升，因此打印的时候还没初始化，就会报错。如果换成var声明就不会有这问题。
```js
let cute='你是小可爱吗';
{
  console.log(cute);//报错说变量未初始化
  let cute='你才是';
}
```
q：生成10个按钮，每个按钮点击的时候弹出1-10
```js
for(let i=1;i<=10;i++){
  var btn=document.createElement('button');
  btn.innerText=i;
  btn.onclick=function(){alert(i)};
  document.body.appendChild(btn);
}
```
q：  
1、给每个li绑定鼠标移入事件。  
2、在鼠标移入的时候，获取当前移入项的内容，然后赋值给一个变量。  
3、改变鼠标移入项的内容，可参考效果图，实现是第几个。  
4、在鼠标移入的时候，改变其字体颜色以及大小。  
5、鼠标移出时，恢复原来的状态以及内容。  
```js
<ul>
	<li>HTML</li>
	<li>CSS</li>
	<li>JavaScript</li>
</ul>
<script type="text/javascript">
	var lis=document.getElementsByTagName("li");
	console.log(lis);
	for(let i=0,len=lis.length;i<len;i++){
		let tmpliHTML;
		tmpliHTML=lis[i].innerHTML;
		lis[i].addEventListener('mouseover',function(){
			lis[i].style.color="red";
			lis[i].style.fontSize="2em";
			lis[i].innerHTML+="我是第"+(i+1)+"个";
		})
		lis[i].addEventListener('mouseout',function(){
			lis[i].style.color="black";
			lis[i].style.fontSize="1em";
			lis[i].innerHTML=tmpliHTML;
		})
	}
</script>
```
## JS字典基本操作
>[js之字典的学习和使用](https://blog.csdn.net/ganyingxie123456/article/details/78163154)

JS中的字典就是array，创建字典对象就是创建array对象
```js
var dic1=new array();
var dic2={b:2,c:3,a:1,1:A,3:C,2:B};
dic1['apple']=1;
dic1['banana']=2;

console.log("直接输出");
for(var key in dic1){//如果key是数字，会自动按序输出
  console.log(key:dic1[key]);
}

console.log("按key排序输出");
var sortKeyRes1=Object.keys(dic1).sort();
for(var key in sortKeyRes1){
  console.log(key:dic1[key]);
}

console.log("按value排序输出");
var sortValueRes1=Object.keys(dic1).sort(function(k1,k2){return dic1[k1]-dic1[k2];});
for(var key in sortValueRes1){
  console.log(key:dic1[key]);
}

console.log("删除元素之方法一（推荐）");
delete dic1['a'];
console.log("删除元素之方法二（当key为数字时无法删除）");
delete dic1.b;
delete dic.2; // 报错 : Uncaught SyntaxError: Unexpected number
delete dic.'2'; // 报错 : Uncaught SyntaxError: Unexpected string
```

## 原生构造函数
* String
* Number
* Boolean
* Array
* Object
* Date
* Function
* Symbol

## 箭头函数与普通函数
>[ES6---箭头函数()=>{} 与function的区别](https://blog.csdn.net/github_38851471/article/details/79446722)

### 写法
```js
//arrow function
var foo=(a,b)=>{return a+b;}
//function
function foo(a,b){return a+b;}
```

### this指针的指向
```js
var arrowFoo=()=>{console.log(this);};
var obj1={k:arrowFoo};
arrowFoo();//Windows
obj.k()//Windows

function foo(){console.log(this);}
var obj2={k:foo};
foo();//Windows
obj2.k();//obj{k:foo}
```
* 箭头函数的this指针始终指向词法作用域，即外层调用者obj。  
* 普通函数的this指针随着调用环境的变化而变化，即始终指向自身obj。

### 构造函数
function可以定义构造器（构造函数），但是箭头函数不行。

### 变量提升
由于JS的内存机制，function的级别最高，而箭头函数需要用var/let const关键词，这种变量不能得到变量提升，因此箭头函数必须定义于调用之前。

## JS自带的的map()方法
### map()概述
map()方法返回一个由数组每一个元素调用一个指定方法后的返回值组成的新数组。
### 使用方法
对一个String使用map获取每个字符所对应的ASCII所组成的数组。
```js
var map=Array.prototype.map;
var a=map.call("Hello JavaScript",function(x){return x.charCodeAt(0);});//a是一个整型数组
```
或者这样写
```js
var a="Hello JavaScript".map(function(x){return x.charCodeAt(0);});
```
### 执行过程解析
通常情况下，map方法中传递的自定义callback函数只需接收1个参数x（只定义一个形参），即正在被遍历的数组元素本身。  
但这不意味着map只给它传了1个参数，实际上传了3个参数，分别是数组元素本身、该元素所对应的数组索引、数组本身，只不过后面2个被callback忽略了而已。  
当我们的callback不止1个形参时就要注意这里传参的含义和顺序了。
```js
["1","2","3"].map(parseInt);
```
上面这个语句返回的结果很容易被误以为是[1,2,3]，但实际上是[1,NaN,NaN]。这是为啥呢？parseInt的形参实际上最多可以有2个，第二个参数是进制数，而map会默认传3个参数给它，前2个会被parseInt接收，而第二个参数元素索引会被parseInt当成是进制数去使用，导致最终得到NaN。
所以最好是全部用自定义的函数作为callback，不要用库函数，比如上面的语句可以改成
```js
["1","2","3"].map(function(x){return parseInt(x,10);});//返回[1,2,3]
```

## JSON字符串转成map解析
>[JSON字符串转成map解析](https://blog.csdn.net/qq_15700115/article/details/89333016?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control)

# JS Array.slice 截取数组

## slice定义

slice() 方法可从已有的数组中返回选定的元素。

## 语法

arrayObject.slice(start,end)

| 参数  | 描述                                                         |
| :---- | :----------------------------------------------------------- |
| start | 必需。规定从何处开始选取。如果是负数，那么它规定从数组尾部开始算起的位置。也就是说，-1 指最后一个元素，-2 指倒数第二个元素，以此类推。 |
| end   | 可选。规定从何处结束选取。该参数是数组片断结束处的数组下标。如果没有指定该参数，那么切分的数组包含从 start 到数组结束的所有元素。如果这个参数是负数，那么它规定的是从数组尾部开始算起的元素。 |

## 返回值

返回一个新的数组，包含从 start 到 end （不包括该元素）的 arrayObject 中的元素。

## 说明

请注意，该方法并不会修改数组，而是返回一个子数组。如果想删除数组中的一段元素，应该使用方法 Array.splice()。

## 提示和注释

注释：您可使用负值从数组的尾部选取元素。
注释：如果 end 未被规定，那么 slice() 方法会选取从 start 到数组结尾的所有元素。

# JS Array.splice 删除数组元素

splice(index,len,[item]) 该方法会改变原始数组。

splice有3个参数，它可以用来替换/删除/添加数组内某一个或者几个值

index:数组开始下标 len: 替换/删除的长度 item:替换的值，删除操作的话 item为空

```js
//删除起始下标为1，长度为2的一个值(len设置2，如果为0，则数组不变) 
var arr2 = ['a','b','c','d'] 
arr2.splice(1,2); 
console.log(arr2); 
//['a','d'] 

//替换起始下标为1，长度为1的一个值为‘ttt'，len设置的1 
var arr = ['a','b','c','d']; 
arr.splice(1,1,'ttt'); 
console.log(arr); 
//['a','ttt','c','d'] 

// 添加 ---- len设置为0，item为添加的值
var arr = ['a','b','c','d']; 
arr.splice(1,0,'ttt'); 
console.log(arr); 
//['a','ttt','b','c','d'] 表示在下标为1处添加一项'ttt' 
```

## delete方法

delete方法删除掉数组中的元素后，会把该下标出的值置为undefined,数组的长度不会变

```js
var arr = ['a','b','c','d']; 
delete arr[1]; 
arr; 
//["a", undefined × 1, "c", "d"] 中间出现两个逗号，数组长度不变，有一项为undefined 
```

# JavaScript trim() 方法

去除字符串的头尾全部空格

```js
var str = "       Runoob        ";
alert(str.trim());
//Runoob
```

