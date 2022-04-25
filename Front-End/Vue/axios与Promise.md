## axios组件
>[axios中文文档|axios中文网](http://www.axios-js.com/zh-cn/docs/)
[【vue学习】axios](https://www.jianshu.com/p/d771bbc61dab)

### axios原理
* 是什么：Axios是一个基于promise的HTTP库，可用于浏览器和node.js中，作为HTTP客户端使用。
* 作用：用于向后台发送请求，同时支持更多可控功能。
* 特性：
```
1)支持浏览器和node.js;
2)支持promise;
3)可拦截请求和响应;
4)可转换请求和响应;
5)可取消请求;
6)自动转换JSON数据;
7)浏览器支持CSRF.
```

#### axios与其他方式的对比
ajax：
```
优点：局部更新；原生支持
缺点：可能破坏浏览器后退功能；嵌套回调
```
jqueryAjax：
```
在原生的ajax的基础上进行了封装；支持jsonp
```
fetch：
```
优点：解决回调地狱
缺点：API 偏底层，需要封装;默认不带Cookie，需要手动添加; 浏览器支持情况不是很友好，需要第三方的ployfill
```
axios：
```
几乎完美
```

### axios怎么用
get和post均基于promise，所以都是用then和catch，用这种方式来发送请求。
在进行请求之前，需要先导入axios库
```js
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```
#### 简单案例
###### 执行GET请求
```js
axios.get('/user?ID=12345')
  .then(function(response){console.log(response);})
  .catch(function(error){console.log(error);});
```
也可以这样写
```js
axios.get('/user',{ params:{ID:12345} })
  .then(function(response){console.log(response);})
  .catch(function(error){console.log(error);});
```
###### 执行POST请求
```js
axios.post('/user',{
  firstName:'Alice',
  lastName:'Smith'
})
  .then(function(response){console.log(response);})
  .catch(function(error){console.log(error);});
```
###### 执行多个并发请求
```js
function getUserAccount(){return axios.get('/user/12345/');}
function getUserPermission(){return axios.get('/user/12345/permissions');}
axios.all([getUserAccount(),getUserPermission()])
  .then(axios.spread(function(acct,perms){console.log('两个请求均执行完成！');}));
```

#### axios API
直接传递配置来发送请求:axios(config)
```js
axios({
  method:'post',
  url:'/user/12345',
  data:{
    firstName:'Alice',
    lastName:'Smith'
  }
})
```

#### 拦截器
在请求或响应在被then/catch处理前拦截他们。
##### 全局添加拦截器
```js
// 全局添加请求拦截器：interceptors.request
axios.interceptors.request.use(
  (config)=>{
    //在发送请求前做一些事
    return config;
  },
  (error)=>{
    //对请求错误做一些事
    return Promise.reject(error);
  }
);
// 全局添加响应拦截器：interceptors.response
axios.interceptors.response.use(
  (response)=>{
    //对响应数据做一些事
    return response;
  },
  (error)=>{
    //对响应错误做一些事
    Promise.reject(error);
  }
);
```
如果后面需要移除拦截器，则需要
```js
const myInterceptor=axios.interceptors.request.use(/*...*/);
axios.interceptors.request.eject(myInterceptor);
```
##### 为自定义的axios实例添加拦截器
```js
const instance=axios.create();
instance.interceptors.request.use(/*...*/);
```

---------------------------------------
## [Promise](https://www.jianshu.com/p/1b63a13c2701)
### 是什么
promise是用于异步操作的对象，可将异步操作队列化，按期望的顺序执行，可根据上一个操作的结果来判断下一步的具体操作，返回预期的结果。
### 为什么
* 异步操作分**事件监听**和**回调**。
* 纯粹的回调函数实现的异步会剥夺函数的return能力，虽然也能解决问题，但是代码可读性降低，维护困难，且容易踏入嵌套层次深的回调地狱。

作用
```md
1. 支持node.js的无阻塞高并发异步操作
2. 解决普通异步回调的回调地狱问题，由于并未剥夺函数return的能力，因此无需层层传递callback，进行回调获取数据。
3. 支持批量执行，合并并等待多个异步操作，全部完成后再反馈结果，亦可其中一个完成就返回结果。
```
特性
```md
1. 在任何一个地方生成了promise队列后，可以将其作为一个变量传递到其他地方
2. 代码风格便于理解、易于维护
```

### 使用
```js
new Promise(
  function(resolve,reject){
    //这里执行一段耗时的异步操作
    resolve('success!');//数据处理完成
    //reject('failed!');//数据处理失败
  }
).then(
  (res)=>{console.log(res);},//成功
  (err)=>{console.log(err);}//失败
)
```
promise只有3种状态：
```md
1. pending【待定】初始状态
2. fullfilled【实现】操作成功
3. rejected【被否决】操作失败
```
只有2种状态变化：
```md
1. pending->fullfilled
2. pending->rejected
```
状态一经改变，永不再变，并触发then()中的响应函数进行后续的处理。
上面的代码中，resolve的作用就是实现第一种状态变化，reject的作用是实现第二种状态变化。
#### 错误处理
promise会自动捕获异常并交给rejected响应函数处理。有2种处理方式：
```js
//第一种
<script>
  new Promise((resolve,reject)=>{
    setTimeout(()=>{reject('bye');}, 2000)
  })
    .then(
      (val)=>{console.log(val);},
      (err)=>{console.log('Error',err);}
    )
</script>
```
```js
//第二种
<script>
  new Promise((resolve)=>{
    setTimeout(()=>throw new Error('bye');}, 2000)
  })
    .then(
      (val)=>{console.log(val);}
    )
    .catch(
      error=>{console.log('Error',error);}
    )
</script>
```
推荐使用第二种方式，更加清晰易读，且可以捕获前面N个then的回调错误。
#### Promise.all()批量执行
用于将多个Promise实例包装成一个新的Promise实例，返回的也是一个普通Promise实例。  
Promise.all([p1,p2,p3])接受一个数组作为参数，数组中的元素可以是Promise实例，也可以是其他值，只有Promise实例会等待状态改变。  
当所有子Promise完成，该Promise完成，返回全部值组成的数组。    
当有1个promise失败，返回第一个失败的子promise的结果。  
```js
//切菜
function cutUp(){
  console.log('开始切菜。');
  var p = new Promise(function(resolve, reject){
    //做一些异步操作
    setTimeout(function(){
        console.log('切菜完毕！');
        resolve('切好的菜');
    }, 1000);
  });
  return p;
}

//烧水
function boil(){
  console.log('开始烧水。');
  var p = new Promise(function(resolve, reject){
    //做一些异步操作
    setTimeout(function(){
      console.log('烧水完毕！');
      resolve('烧好的水');
    }, 1000);
  });
  return p;
}

Promise.all([cutUp(), boil()])
  .then(
    (result) => {
      console.log('准备工作完毕');
      console.log(result);
    }
  );
```
#### Promise.race()
类似于Promise.all()，区别在于Promise.race()只要有1个完成就算完成。
```js
let p1 = new Promise(
  resolve => {setTimeout(() => {resolve('I\`m p1 ')}, 1000)}
);
let p2 = new Promise(
  resolve => {setTimeout(() => {resolve('I\`m p2 ')}, 2000)}
);
Promise.race([p1, p2])
  .then(value => {console.log(value)})
```
#### 常见用法
将Promise的异步操作与定时器放一起，如果超时仍未返回结果，则告知用户超时。
