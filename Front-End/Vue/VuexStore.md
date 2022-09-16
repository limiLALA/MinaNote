store用于存储一些需要全局使用的变量数据，使用this.\$store.getters.tools来获取变量tools，并通过this.\$store.dispatch来更新这些变量

# 定义变量

## 准备工作

创建1个vue项目，在src目录下新建store目录，index.js、getters.js以及要用于存储变量的fcd.js，目录结构如下

```
src
├── store
│   └── modules
│       └── fcd.js
├────── getters.js
└────── index.js
```

### index.js入口文件

```js
import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import fcd from './modules/fcd';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    fcd,
  },
  getters,
});

export default store;
```

### getters.js

```js
const getters = {
  fcd_params: state => state.fcd.fcd_params,
  select_tab_name: state => state.fcd.select_tab_name,
};
export default getters;
```

### fcd.js模块

```js
const state = {
  fcd_params: {},
  select_tab_name: '',
};

const mutations = {
  SET_FCD_PARAMS: (state, fcdParams) => {
    state.fcd_params = fcdParams;
  },
  SET_SELECT_TAB_NAME: (state, selectTabName) => {
    state.select_tab_name = selectTabName;
  },
};

export default {
  state,
  mutations,
};
```

## 使用方式

设置变量值：`this.$store.commit('SET_SELECT_TAB_NAME', newVal)`

获取变量值：`this.$store.getters.select_tab_name`

# $store.dispatch

用于调用actions中的异步方法（通常是需要网络通信操作的方法），而这个异步方法中**必须要用commit(‘SET_TOKEN’, tokenV)调用mutations里的方法，才能在store存储成功。**

[vuex里面的this.$store.dispatch方法](https://blog.csdn.net/lemonC77/article/details/95077691)

# $store.commit

用于调用mutations中的方法来更新store中存储的值，不支持异步方法

# v-model绑定VuexStore变量的正确使用方式

像下面这样直接绑定是不对的，store变量不带get和set方法，会报错

```vue
<el-tabs v-model="$store.getters.select_tab_name">...</el-tabs>
```

需要借助computed钩子

```vue
<template>
    <el-tabs v-model="selectTabName">...</el-tabs>
</template>
<script>
    export default {
        computed: {
            selectTabName: {
                get() {
                    // 这里也是用了Vuex里的 modules 大家可以当成普通的变量来看
                    return this.$store.getters.select_tab_name;
                },
                set(newVal) {
                    this.$store.commit('SET_SELECT_TAB_NAME', newVal);
                },
            },
        },
    }
</script>
```

> [Vue中v-model如何和Vuex结合起来](https://blog.csdn.net/pqn_cc/article/details/123737836)