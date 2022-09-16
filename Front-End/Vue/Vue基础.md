># 参考资料
>[官方教程](https://cn.vuejs.org/)   
>[Vue.js 目录结构](https://www.runoob.com/vue2/vue-directory-structure.html)  
>[Vue.js：a (re)introduction](https://zhuanlan.zhihu.com/p/20302927)  
>[Vue组件化开发](https://www.cnblogs.com/yinhaiying/p/10985476.html)  
>[从零开始搭建vue+element-ui后台管理系统项目到上线](https://www.cnblogs.com/gaosong-shuhong/p/10119819.html)  
>[进阶实战：vue-element-admin](https://panjiachen.github.io/vue-element-admin-site/zh/guide/)   
>[vue-element-admin源码分析](https://blog.csdn.net/qq_29729735/article/details/82853556)  
>[父组件和子组件之间的生命周期执行顺序](https://www.cnblogs.com/qinglaoshi/p/13276335.html)  
>[什么是VUE的父组件和子组件？那么父组件和子组件又是怎样传值的呢？](https://blog.csdn.net/gaoxin666/article/details/83279001)  
>[对vue虚拟DOM理解](https://blog.csdn.net/weixin_46409503/article/details/105054669?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-0.control&spm=1001.2101.3001.4242)  
>[vue-router的基础知识，很重要！！！](https://blog.csdn.net/weixin_44776706/article/details/105871273?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-0.control&spm=1001.2101.3001.4242)  
>[vue-router实现单页面路由原理](https://zhang122622623.github.io/2018/03/14/vue-router%E5%AE%9E%E7%8E%B0%E5%8D%95%E9%A1%B5%E9%9D%A2%E8%B7%AF%E7%94%B1%E5%8E%9F%E7%90%86/)  
>[Vue.js——vue-router 60分钟快速入门](https://www.cnblogs.com/keepfool/p/5690366.html)




# Vue的基本使用
vue表达式：
```HTML
<div id="app">
  <p>{{number+1}}</p>
  <p>{{OK?'是':'否'}}</p>
  <p>{{'厦门大学，'+id}}</p>
</div>
<script type="text/javascript">
  var vm = new Vue({
    el: '#app',
    data:{
      number: 100,
      OK: true,
      id: 1
    }
})
</script>
```

## 全局API
#### Vue.use
Vue.use()的作用就是让它里面被注册的组件能够被全局使用。
#### 全局过滤器Vue.filter和局部过滤器filters
>[vue filter的四种用法](https://blog.csdn.net/qappleh/article/details/89639948)

Vue.js支持自定义过滤器，可用于一些常见的文本格式化，比如将英文字符串的首字母大写，或者筛选含有指定字符的元素。  
示例：vueFilterSimpleDemo.html和vueFilterListDemo.html。  
最常用的还是在list上使用filter。

## 指令
#### 条件渲染：v-if

#### 列表渲染：v-for

#### 原始HTML：v-html

#### 绑定属性：v-bind

#### 绑定事件：v-on:事件名，简写@事件名

#### 表单数据：v-model创建双向数据绑定


## 选项/数据（options/data）
### data
### props
props类型为数组或对象，用于接收父组件传递的数据，父组件可以修改这些数据值，而子组件不能修改，除非取其值放在data或者computed属性中return。  
如果props的的类型为数组，则只能设置数据名称；如果是对象，还可以配置高级options，进行类型检查、设置默认值、自定义验证等。  
可配置的选项如下：
```md
type：可选参数有原生构造函数中的任一种，如String、Number、Boolean、Array、Object、Function、Symbol、任意自定义构造函数、上述内容组成的数组。当父组件进行传值时，会先检查是否是指定的数据类型，如果不是，会抛出警告。  
default：可以是任意值，如果父组件没有传入该props，则使用默认值。该值必须用一个工厂函数返回。  
required：Boolean。如果为true，则该props为必填项，否则不是必须。如果为true而没有被传入，控制台会抛出警告。  
validator：Function。自动验证函数会将props的值作为唯一输入。如果函数返回验证失败，控制台会抛出警告。
```
#### props的大小写问题
HTML的attribute对大小写不敏感，浏览器会将所有的大写字母解释成小写，如果props名是camelCase（驼峰命名法），则需要在模板中使用等价的kebab-case（短横线命名法）。如果使用字符串模板，就无此限制。
#### 单向数据流
所有父子之间的props都有形成一个单向下行的绑定：父级props的更新会向下流动到子组件中，反过来就不行。可防止子组件意外改变父组件的状态。  
如果子组件内部尝试改变props的值，控制台会抛出警告。
##### 变更props的2种形式
1. props作为初始值传入，子组件接下来将其作为一个本地的数据变量来用
```js
props:['fatherMsg'],
data():{
    return {
      sonMsg: this.fatherMsg
    }
}
```
2. 用计算属性直接将props原始值传入并进行转换，缓存在系统
```js
props:['fatherMsg'],
computed:{
    sonData:{
      return this.fatherMsg.toUpperCase()
    }
}
```

#### 自定义验证函数
```js
props:{
  // 基础的类型检查（null和undefined会通过任何类型检查）
  propA:Number,
  // 列举多个可能的类型，满足其中之一即可
  propB:[String,Number,Boolean],
  propC:{
    type:Object,
    required:true,
    default:function(){
      return {message:'Who am I?'}
    }
  }
  propD:{
    type:String,
    validator:function(value){
      return ['success','failed','warning','error'].indexOf(value) !== -1
    }
  }
}
```
>注意：props会在组件实例创建之前验证，因此组件中的其他属性在props中不可用。

#### 替换/合并已有的Attribute
子组件的模板中声明的Attribute，如果父组件中也进行了赋值，那么子组件的值会被覆盖/合并。当被赋值的是class和style，会自动智能合并父子组件中的值（以空格分隔），如果不是，则会直接覆盖掉子组件的值。

### 计算属性：computed
会将计算结果缓存在系统中，methods不缓存
```HTML
<div id="app">
  {{getTime1}}<br/>
  {{getTime2()}}
</div>
```
### 方法属性：methods
### 监控：watch
watch的作用可以监控一个值的变换，并调用因为变化需要执行的方法。可以通过watch动态改变关联的状态。
```js
data:{
    a:1,
    b:{
        c:1
    }
},
watch:{
    a(val, oldVal){//普通的watch监听
        console.log("a: "+val, oldVal);
    },
    b:{//深度监听，可监听到对象、数组的变化
        handler(val, oldVal){
            console.log("b.c: "+val.c, oldVal.c);
        },
        deep:true //true 深度监听
    }
}
```

## 内置组件
### 声明组件：Vue.component
### 过渡效果组件：transition

## vue打包后的运行

> [Vue项目build打包后如何运行](https://blog.csdn.net/weixin_42608885/article/details/121065519)


# Vue原理
## 第一个Hello Vue代码详解
#### 1.将vue.js文件引入到当前页面
```HTML
<!-- 本地引入 -->
<script src="vue.js" type="text/javascript" charset="utf-8"></script>
<!-- 外部引入 -->
<script src="https://unpkg.com/vue/dist/vue.js" charset="utf-8"></script>
```
只要将vue.js文件引入页面，在当前环境就会多出一个全局变量：Vue

#### 2.通过全局构造函数：Vue ，实例化一个Vue应用程序接管的元素（包括所有的子元素）
```HTML
<script type="text/javascript">
var app=new Vue({
  el:'#app', //el:element 的简写 ，用来指定Vue应用程序接管的元素（包括所有的子元素）
  data:{ //data:data就是Vue实例应用程序中的数据成员
      message:'Hello Vue!'
  }
});
</script>
```

#### 3.代码执行流程解析
###### 1)浏览器从上到下依次进行解析  
浏览器对于id=app 的div 内部的 {{message}}不认识，直接作为普通文本渲染到网页上
###### 2)浏览器继续往后解析执行  
发现有一个js外链脚本，发起请求进行下载
当当前页面环境拿到js脚本之后，vue.js就会执行，执行结束，就向全局暴露出了一个对象：Vue
###### 3)当解析执行到咱们自己的Script的时候，开始解析执行咱们自己的代码

>通过 el 属性 指定 Vue程序 的接管范围  
通过 data 向Vue 实例的应用程序中初始化了一个 message 成员  
Vue 程序通过 el 属性指定id为 #app 的div  
开始解析执行 Vue 能识别的语法  
{{message}} 在Vue 中被称为双花括号插值表达式  
在双括号插值表达式中可以使用 当前元素 所属Vue程序 接管范围的data中的数据

## Vue的虚拟DOM树
在需要频繁对复杂DOM树进行操作的场景下，容易产生前端性能的瓶颈。Virtual DOM的出现就是为了解决这个性能瓶颈的问题。  
Virtual DOM是一棵基于JavaScript对象(VNode节点)的树，用对象属性来描述节点，是对真实DOM树的抽象，可完整映射到真实DOM树。
##### Virtual DOM框架/工具的原理
1. 一开始根据虚拟DOM树渲染出真实DOM
2. 当数据变化/页面需要重新渲染时，重新生成一个完整的虚拟DOM树
3. 使用diff算法对比虚拟DOM与真实DOM的区别，只更新需要更新的地方，减少真实DOM的操作，提升性能。

#### 虚拟dom和真实dom的区别？
虚拟dom不会进行重排和重绘  
虚拟dom大大提高了真实dom处理的效率和浏览器的效率，即减少了真实dom重排和重绘的次数  

#### 虚拟dom是如何更新真实dom的
虚拟dom树的节点被改变时，会生成一颗新的虚拟dom树，diff算法会计算出被改变的部分  
根据被改变的部分更新真实DOM

#### Diff算法
三种策略，顺序执行：Tree diff、Component Diff、Element Diff
###### Tree Diff
对树的每一层进行遍历，找出不同的，只会同层比较
###### Component Diff
如果都是同一类型的组件(即：两节点是同一个组件类的两个不同实例)，按照原策略继续比较Virtual DOM树即可。  
如果出现不是同一类型的组件，则将该组件判断为dirty component，从而替换整个组件下的所有子节点。
###### Element Diff
当节点处于同一层级时，diff 提供三种节点操作：  
* INSERT_MARKUP（插入）：如果新的组件类型不在旧集合里，即全新的节点，需要对新节点执行插入操作。
* MOVE_EXISTING （移动）：旧集合中有新组件类型，且 element 是可更新的类型，generatorComponentChildren 已调用 receiveComponent，这种情况下 prevChild=nextChild，就需要做移动操作，可以复用以前的 DOM 节点。
* REMOVE_NODE （删除）：旧组件类型，在新集合里也有，但对应的 elememt 不同则不能直接复用和更新，需要执行删除


## 父子组件
当我们将一个vue文件（包含模板、js脚本、css样本（可选））封装成一个组件A，这个组件A被组件B引入，则组件B就叫做父组件，组件A叫做子组件。  
父子组件通过props进行传值，并且是单向传值。  
父组件可以调用子组件的methods中的函数。


## Vue的生命周期
![vue的生命周期](vue的生命周期.png)
Vue的每个组件都有自己的生命周期，包括了从创建、数据初始化、挂载、更新、销毁全流程。对应的具体钩子如下：
```JavaScript
beforeCreate
created
beforeMount
mounted
(
  beforeUpdate
  updated
)
beforeDestroy
destroyed
```
假设我们创建了一个vm实例，将其挂载到id为"app"的元素上，其生命周期如下：

| 生命周期钩子 | 执行时间 |
| :------------- | :------------- |
|beforeCreate |在实例初始化之后，数据观测(data observer)和event/watcher事件配置之前被调用。此时data属性为undefined|
|created      |实例完成之前被调用，此时实例已完成数据观测、属性和方法的运算，watch/event事件回调这些配置。但是挂载尚未开始，$el属性暂时不可见。|
|beforeMounte |在挂载之前被调用，页面视图没有更新（如显示{{message}}，这里应用虚拟DOM技术，先把“坑位”占住，等调用mounted时再把值渲染上去），相关render函数首次被调用。如果实例没有el选项，会停止编译，即生命周期停止，直到在该vue实例上调用了vm.$mount(el)|
|mounted      |el被新创建的vm.$el替换，并挂载到实例上去之后调用该钩子。如果root实例挂载了一个文档内的元素，那么mounted被调用时，vm.$el也在文档内|
|beforeUpdate |数据更新时、虚拟DOM重新渲染和打补丁之前调用，可在这个钩子中进一步更改状态，不会触发额外的重渲染过程|
|updated      |组件DOM更新后调用，可以在里面执行依赖于DOM的操作|
|activated    |keep-alive激活时调用|
|deactivated  |keep-alive停用时调用|
|beforeDestroy|实例销毁前调用，此时实例依然可用|
|destroyed    |实例销毁后调用，此时vue绑定的东西都会解绑，事件监听器会移除，所有子实例会被销毁。注意这里的销毁不是“抹去”，而是解绑|

### 父子组件的生命周期
组件的调用顺序是先父后子，组件渲染的顺序是先子后父。组件的销毁是先父后子，销毁完成的顺序是先子后父。
- 加载渲染过程：子组件在父组件的beforeMount和Mounted之间渲染
  - 父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted
- 子组件更新过程
  - 父beforeUpdate->子beforeUpdate->子updated->父updated
- 父组件更新过程
  - 影响到子组件： - 父beforeUpdate -> 子beforeUpdate->子updated -> 父updted
  - 不影响子组件： - 父beforeUpdate -> 父updated
- 销毁过程
  - 父beforeDestroy->子beforeDestroy->子destroyed->父destroyed

子组件在执行mounted阶段时，已经挂载到了父组件上，随后父组件挂载到页面上。  
如果子组件被\<keep-alive>包裹，那么activated钩子会在父子组件全部被挂载到页面之后被触发，如果没有包裹，则不会被触发。  
当我们早mounted后中途改变vm.show=false，此时的数据更新会触发视图更新，先执行beforeUpdate，然后执行deactivated，最后updated。deactivated只有在视图更新时才能知道\<keep-alive>被停用了。  
生命周期钩子会自动将this上下文绑定到实例中，而箭头函数的this指向的是外层调用者（父级），所以不能用箭头函数来定义生命周期方法。

### 钩子函数的应用
- 在created函数中可以对data数据进行操作，此时可进行ajax请求，将返回的数据赋给data。
- updated函数会在数据变化时被触发，但是无法判断是哪个属性值变化，在实际情况中要用computed或match函数来监听属性的变化，并做一些操作。
- 一般会在mounted函数中对挂载的DOM进行操作，此时DOM已经被渲染到了页面上。
- 在使用vue-router时有时需要使用<keep-alive>来缓存组件状态，避免频繁调用created钩子。如果子组件需要在每次加载或切换状态
时进行一些操作，可写在activated钩子中触发。

>[vue 生命周期中的钩子函数及父子组件的执行顺序](https://www.jianshu.com/p/904044deed3e)


## vue-router实现单页面路由原理




# 零散知识点

## CDN
* 是什么：CDN的全称是Content Delivery Network，即内容分发网络。CDN是构建在现有网络基础之上的智能虚拟网络，依靠部署在各地的边缘服务器，通过中心平台的负载均衡、内容分发、调度等功能模块，使用户就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。  
* 作用：打开一个网页时，从服务器请求资源需要时间，CDN的作用就是加速这个过程。
* 使用：[UNPKG](https://unpkg.com/)就是一个用于快速下载npm包的CDN，在HTML中的使用方法如
```js
<script src="unpkg.com/:package@:version/:file">
```

