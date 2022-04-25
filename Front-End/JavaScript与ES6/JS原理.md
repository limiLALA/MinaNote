>###### 完整教程  
[ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/intro)  
[JavaScript 教程](https://wangdoc.com/javascript/)

------------------------
# JS原理
## JS的类(构造器)
>[JavaScript对象、函数和类](https://www.cnblogs.com/cloudsu/p/11504652.html)
[Javascript中的类实现](https://blog.csdn.net/amwayy/article/details/83266380?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control)

JS本身不是OOP的语言，需要自己去实现类的功能。

在JS中，类的定义与函数一样，都是使用function关键字来定义，本质都是类，类中用var定义的属性是私有的，this定义的属性是公有的。
在创建类的实例对象时，使用：var c=new MyClass();
而创建函数的实例对象则是进行赋值操作：var f=foo();
类的命名使用大驼峰命名法，函数使用小驼峰命名法。

### this使用误区
由于JS不是OOP的，所以类的this指针并不是一直指向对象自己，在事件处理时会出现指错的情况。我们想要让对象的成员函数响应个某个事件，当该事件被触发，系统会调用该成员函数，但是此时传入的this指针就不是对象本身了。  
解决方案：可以在定义类的时候就定义一个私有属性_this赋值为this，这样在成员函数中就可以使用_this来访问公有属性了。

## async 和 await
>[async 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/async.html)

### async是什么
* async是Promise的语法糖，async+await可以理解为Generator函数在某些场景下的语法糖。
* async函数就是Generator函数与特定spawn执行器的结合，将Generator函数的星号（*）替换成async，将yield替换成await。  

比如定义一个文件IO的异步函数，并异步调用，2种写法如下所示：
```js
var fs=require('fs');
var readFile=function(fileName){
  return new Promise(function(resolve,reject){
    fs.readFile(fileName,function(error,data){
      if(error)reject(error);
      resolve(data);
    });
  });
};
//Generator函数写法（星号+yield）
var gen=function*(){
  var f1=yield readFile('/data/file1');
  var f2=yield readFile('/data/file2');
}
//async+await写法
var gen=async function(){
  var f1=await readFile('/data/file1');
  var f2=await readFile('/data/file2');
}
```

注意，如果Generator的执行器不同，其效果也是不同的
```js
function now() {
    var d = new Date();
    return ('0' + d.getHours()).substr(-2) + ':' + ('0' + d.getMinutes()).substr(-2) + ':' + ('0' + d.getSeconds()).substr(-2);
}
function sleep(t, n) {
    return new Promise(function (resolve) {
        console.log('begin: ' + n + ' sleep ' + t + 'ms, ' + now());
        setTimeout(function () {
            console.log('end: ' + n + ' slept ' + t + 'ms, ' + now());
            resolve();
        }, t);
    });
}
async function asyncFunc(n) {
    await sleep(2000, n);
    await sleep(3000, n);
}
function* gen(n) {
    yield sleep(2000, n);
    yield sleep(3000, n);
}
function spawn1(g) {
    var r = g.next('spawn1');
    if (r.value != undefined) {
        r.value.then(function () {
            spawn1(g);
        });
    }
}
function spawn2(g) {
    var pool = [];
    for (var r=g.next('spawn2'); r.value!=undefined; r=g.next('spawn2')) {
        pool.push(g.value);
    }
    Promise.all(pool);
}

spawn1(gen('spawn1'));
spawn2(gen('spawn2'));
asyncFunc('asyncFunc');
```
执行结果如下：
```
begin: spawn1 sleep 2000ms, 20:06:46
begin: spawn2 sleep 2000ms, 20:06:46
begin: spawn2 sleep 3000ms, 20:06:46
begin: asyncFunc sleep 2000ms, 20:06:46
end: spawn1 slept 2000ms, 20:06:48
begin: spawn1 sleep 3000ms, 20:06:48
end: spawn2 slept 2000ms, 20:06:48
end: asyncFunc slept 2000ms, 20:06:48
begin: asyncFunc sleep 3000ms, 20:06:48
end: spawn2 slept 3000ms, 20:06:49
end: spawn1 slept 3000ms, 20:06:51
end: asyncFunc slept 3000ms, 20:06:51
```
像上面的spawn1+Generator就等价于aysnc+await，2个sleep操作是继发执行的；  
而spawn2+Generator的2个sleep则是并发执行的。

### async的优点
1. 内置执行器。Generator函数必须依赖执行器spawn函数，所以有了co函数库。而async自带执行器，其执行方法与普通函数一模一样，仅需一行。
2. 语义更清晰。在编写代码的时候，async和await，比起星号和yield，语义更清楚。async表示函数中有异步操作，await表示需要等待紧跟在后面的表达式的结果。
3. 适用性更广。co函数库规定，yield命令后面只能是Thunk韩式或Promise对象，而async函数中的await命令后面可以是Promise对象或原始类型的值（如数值、字符串、布尔值），如果跟原始类型的值，则等同于同步操作（和不加await一样）。

### async函数的用法
和Generator函数一样，async函数返回一个Promise对象，可使用then方法添加回调函数。当函数执行的时候，一旦遇到await命令会先返回，等到await后面的异步操作执行完毕，再接着执行函数体内后面的语句。
#### async/await 的优势在于处理 then 链
和纯Promise的then的写法相比，async/await可以使代码更加“好看”。不过单一的Promise链无法体现优势，当有多个Promise组成的then链，且这些Promise之间有结果依赖关系时，async/await的优势就比较明显了。    
假设有一个业务，分成多个异步步骤(用setTimeout来模拟异步操作)，每个步骤都依赖于前一个步骤的结果，用then链的写法如下：
```js
//异步耗时操作，传入执行时间n，执行完毕后返回n+100作为下一步的执行时间
function takeLongTime(n){
  return new Promise(function(resolve) {
    setTimeout(()=>resolve(n+100),n);
  });
}
function step1(n1){
  console.log(`step1:${n1}`);
  return takeLongTime(n1);
}
function step2(n1,n2){
  console.log(`step2:${n1},${n2}`);
  return takeLongTime(n1+n2);
}
function step3(n1,n2,n3){
  console.log(`step3:${n1},${n2},${n3}`);
  return takeLongTime(n1+n2+n3);
}
function test(){
  console.time("test then");
  const n1=100;
  step1(n1)
    .then((n2)=>{
      return step2(n1,n2).then((n3)=>[n1,n2,n3]);
    })
    .then((ns)=>{
      const [n1,n2,n3]=ns;
      return step3(n1,n2,n3);
    })
    .then((res)=>{
      console.log(`Final result is ${res}`);
      console.timeEnd("test then");
    })
}
test();
```
而用async/await来写的话，test函数的实现就是这样:
```js
async function test(){
  console.time("test await");
  const n1=100;
  const n2=await step1(n1);//返回resolve的结果100+100=200
  const n3=await step2(n1,n2);//返回resolve的结果100+200+100=400
  const res=await step3(n1,n2,n3);//返回resolve的结果100+200+400+100=800
  console.log(`Final result is ${res}`);
  console.timeEnd("test await");
}
```
可以看到省去了参数解析的过程，看起来更加清晰易懂。

### 注意点
await仅仅是获取Promise对象resolve的结果，那如果reject的话要怎么办呢？所以最好是将await放在try...catch中使用
```js
async function test(){
  try{
    await takeLongTime(100);
  }catch(err){
    console.log(err);
  }
}
//或者这样写
async function test(){
  await takeLongTime(100).catch(err=>{
    console.log(err);
  });
}
```
await必须放在async函数中用，否则会报错。另外，不同的调用方式也会有不同的执行效果。
```js
function takeLongTime(n){
  return new Promise(function(resolve) {
    console.log(`start ${n}`)
    setTimeout(()=>{
      resolve(n);
      console.log(`end ${n}`);
    },n);
  });
}
async function test(){
  let times=[100,200,300];
  let results=[];

  //使用for循环遍历times的方式，最终是按顺序继发执行
  console.time("for times");
  for(let time of times){
    results.push(await takeLongTime(time));
  }
  console.timeEnd("for times");

  //使用forEach+async声明的方式，会导致3个readFile操作并发执行，并且不会阻塞在这里，因此这段代码的计时时间非常短
  results=[];
  console.time("forEach");
  times.forEach(async function(time){
    results.push(await takeLongTime(time));
  });
  console.timeEnd("forEach");

  //还可使用Promise.all实现并发执行，但是会阻塞在await这一行代码，直到所有promise执行完毕才会停止计时
  results=[];
  console.time("Promise.all");
  let promises=times.map(time=>takeLongTime(time))//返回的是3个Promise对象组成的数组
  results=await Promise.all(promises)
  console.timeEnd("Promise.all");

  //或者直接用for循环遍历Promise对象数组，对每个promise对象执行await，效果同Promise.all
  results=[];
  promises=times.map(time=>takeLongTime(time))
  console.time("for promises");
  for(let promise of promises){
    results.push(await promise);
  }
  console.timeEnd("for promises");
}
test();
```
执行结果如下
```
 start 100
 end 100
 start 200
 end 200
 start 300
 end 300
 for times: 630.247802734375 ms
 start 100
 start 200
 start 300
 forEach: 0.426025390625 ms
 start 100
 start 200
 start 300
2 end 100
2 end 200
2 end 300
 Promise.all: 311.083984375 ms
 start 100
 start 200
 start 300
 end 100
 end 200
 end 300
 for promises: 308.949951171875 ms
```
可以看到forEach的end和Promise.all的end是同时打印的（end前面有个2），说明使用forEach就会变成非阻塞式的await。

### 总结
- Promise用于封装耗时的异步操作。
- async会将其后的函数（函数表达式或Lambda）返回值封装成一个Promise对象。
- async函数的调用不会造成阻塞，内部的阻塞操作都封装在Promise对象中异步执行。
- await本身是个运算符，用于组成表达式，其运算结果取决于它等的东西。
  - 如果它等到的不是一个Promise对象，那await表达式的运算结果就是它等到的东西，比如一个字符串。
  - 如果它等到的是一个Promise对象，await就忙起来了，它要阻塞后面的代码，等Promise对象resolve，然后拿到resolve的值，作为它的运算结果。
- await会阻塞当前路径（函数），但不阻塞其他路径（函数）的代码。
- await运算符必须用在async声明的函数中，否则会报错。
- 当有多个异步操作需要await时，不同的使用方式会造成不同的执行效果。
