作用：用于封装一小段想要复用的代码

# 代码复用
```js
// 模态框
const Modal = {
  template: '#modal',
  data() {
    return {
      isShowing: false
    }
  },
  methods: {
    toggleShow() {
      this.isShowing = !this.isShowing;
    }
  },
  components: {
    appChild: Child
  }
}
```

```js
// 提示框
const Tooltip = {
  template: '#tooltip',
  data() {
    return {
      isShowing: false
    }
  },
  methods: {
    toggleShow() {
      this.isShowing = !this.isShowing;
    }
  },
  components: {
    appChild: Child
  }
}
```

上面2个变量中定义了相同的变量isShowing和方法toggleShow，可以将它抽离出来封装成另一个变量toggle，再引入

```js
const toggle = {
    data () {
        isshowing: false
    },
    methods: {
        toggleShow() {
            this.isshowing = !this.isshowing
        }
    }
}

// 下面即可使用了
// mixins: [变量名]

const Modal = {
  template: '#modal',
  mixins: [toggle],
  components: {
    appChild: Child
  }
};

const Tooltip = {
  template: '#tooltip',
  mixins: [toggle],
  components: {
    appChild: Child
  }
};
```

如果是vue-cli组件化的项目，可以分成2个文件来写
```js
// mixin.js

export const toggle = {
    data () {
        isshowing: false
    },
    methods: {
        toggleShow() {
            this.isshowing = !this.isshowing
        }
    }
}
```

```js
// modal.vue
// 将mixin引入该组件，就可以直接使用 toggleShow() 了
import {mixin} from '../mixin.js'

export default {
    mixins: [mixin]
}
// tooltip组件同上
```

# 属性合并

## data数据对象

mixin的数据对象和组件的数据发生冲突时以组件数据优先。

## 生命周期钩子函数

同名钩子函数将被加入数组，都将被调用，不过mixin的钩子函数先于组件的被调用到。

## value为对象的选项

如method、components、directives，将混合成一个对象，但是如果键名出现冲突，取组件对象的键值对。

## 全局混入

全局混合会注入每一个组件对象上，使用时必须非常小心，一般不建议使用。

一个使用合理的例子：

```js
// 为自定义的选项 'myOption' 注入一个处理器。
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hello!'
})
// => "hello!"
```

