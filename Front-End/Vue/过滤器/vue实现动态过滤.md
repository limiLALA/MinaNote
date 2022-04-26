# 使用vue自带的filters属性定义过滤器
代码见inputFilterDemo1.vue

过滤器定义

```js
filters: {
    filterTools(toolsData, that) {
      const name = that.inputFilter.tool_name.trim();
      let data;
      // 包含"",null,undefined,NaN多种情况
      if (name && that.inputFilter.status) {
        data = toolsData.filter(item => item.name.indexOf(name) > -1 && item.status === that.inputFilter.status);
      } else if (name) {
        data = toolsData.filter(item => item.name.indexOf(name) > -1);
      } else if (that.inputFilter.status) {
        data = toolsData.filter(item => item.status === that.inputFilter.status);
      } else {
        data = toolsData;
      }
      return data;
    },
},
```

引用时使用`:data="tools.data|filterTools(that)"`这种方式，注意tools.data为第一个入参，that为第二个入参
Vue实例中filters不依赖于当前vue实例上下文，所以在filters中使用this会发现this为undefined，如果要用，需要在data属性中声明一个that变量指向vue示例对象this

```js
data() {
    return {
    	that: this,
    }
}
```

使用时传参that

```vue
<el-table
    :data="tools.data|filterTools(that)"
>
```

# 在computed中定义过滤函数

代码见inputFilterDemo2.vue
注意：计算属性中的函数都是无参的，当遇到需要根据html文本改变，v-for的数据等情况而改变时，computed的功能就无法满足我们的需求了。那我们就可以使用methods代替。

[vue使用computed实现动态过滤](https://www.cnblogs.com/insus/p/13401679.html)

[Vue2.0 no-side-effects-in-computed-properties WARNING处理](https://blog.csdn.net/elie_yang/article/details/80472640)

# 在methods中定义过滤函数

```js
data: {
    shopItemType: {}
},
methods: {
    shopItemType2str(id){
        return this.shopItemType[id];
    }
}
```

```html
<tr v-for="shopItem in shopItems">
    <td>{{shopItemType2str(shopItem.item_type)}}</td>
</tr>
```

