## 参考资料
[官方教程](https://cn.vuejs.org/)

CDN
打开一个网页时，从服务器请求资源需要时间，CDN的作用就是加速这个过程。

cmd: vue ui

条件渲染：v-if

列表渲染：v-for

原始HTML：v-html

表达式：
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

绑定属性：v-bind

绑定事件：v-on:事件名，简写@事件名

表单数据：v-model创建双向数据绑定

过滤器：filters
```HTML
<div id="app">
  {{message|myfilter}}
  {{message|filter2(arg1,arg2)}}
</div>
```

计算属性：computed
会将计算结果缓存在系统中，methods不缓存
```HTML
<div id="app">
  {{getTime1}}<br/>
  {{getTime2()}}
</div>
```

声明组件：Vue.component

axios组件

生命周期

## 脚手架Vue CLI
安装node.js
NPM包管理工具
