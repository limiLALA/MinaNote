# 基础知识

## 多页应用与单页应用

多页应用在每次进入一个新页面时都要向服务器发送http请求，拿到html文件然后再加载出来，所以每次页面切换都会比较慢，但是首屏时间快。由于谷歌百度这些搜索引擎在做网页排名的时候，需要根据网页的内容来做绑定和权重，而搜索引擎是可以识别html中的内容的，多页面应用都是使用html文件，所以它的搜索引擎的排名效果是非常好的，即SEO效果好。
单页应用的原理是利用js感知url的变化，通过js动态的将当前页面删除掉，然后将下一个页面内容挂载到当前页面上并渲染出来。无需向服务器请求html文件，解决了很多http请求的时延，因此页面切换都非常快速，但是首屏时间稍慢，因为除了要加载index.html外，还要进行js请求，请求都返回了才会展示出来。但是由于是js渲染，没有html文件，所以单文件应用的SEO效果差，但是它有相应的解决方案可以解决这2个问题，使其达到完美。

# 实战经验

## 辅助npm组件包
- **fastclick**：单独使用click组件时，会有3秒钟的延迟，在main.js中引入fastclick后可以解决这个延时问题。
- **stylus**：CSS样式工具，简化css的编写（不需要使用{}，而是使用缩进）。

```js
<style lang="stylus" scoped>	/* scoped表示这个样式仅对当前组件有效，不会影响到其他组件 */
  .header
    display: flex /* 自适应填充 */
    line-height: 43px
    background: #bcd4
    color: #fff
    .header-left
      width: 32px
      float: left
    .header-input
      flex: 1
      height: 32px
      line-height: 32px
      margin-top: 6px
      margin-left: 1px
      background: #fff
      border-radius: 6px
      color: #ccc
    .header-right
      width: 1.24px
      float: right
      text-align: center
</style>
```

## 调试vue项目

前端项目也是可以像后端一样打断点debug，下面的博客讲的很清晰，一步一图，可直接参考

>[VueJs(15)--- Webstorm+Chrome 调试Vue项目](https://www.cnblogs.com/qdhxhz/p/14111320.html)

## Vue之socket.io

前后端交互时，使用的最基本的工具是ajax，但是ajax无法实时更新数据，采用前端轮询后端的方式开销很大。socket.io可以解决这个问题，后端可以主动推送消息给前端。

```js
import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client'
Vue.use(
  new VueSocketio({
    connection: socketio.io(process.env.VUE_APP_SOCKET_BASEURL + '/naas', {
      transports: ['websocket', 'xhr-polling', 'jsonp-polling'],
      transportOptions: {
        polling: {
          extraHeaders: {
            authorization: 'Bearer ' + store.state.user.access_token
          }
        }
      }
    }),
    debug: false
  })
)

// 组件实例中直接用 this.$socket就可以完成

this.$socket.emit('join', {
//触发后端事件
  room: this.robotInfo.robotNo,
  flow_id: this.workflowListChecked.id,
  flowVersion: this.workflowListChecked.flowVersion
})

//监听后端的推送
this.$socket.on('connect', (data: any) => {})
this.$socket.on('disconnect', (data: any) => {
  // this.$socket.connect()
})
```



> [在vue中使用socket.io](https://www.jianshu.com/p/552af264d2ea)
>
> [vue中socket的使用](https://blog.csdn.net/aliven1/article/details/122115287)

## webpack-dev-server

[Vue基础技术|webpack-dev-server的配置和使用](https://blog.csdn.net/gbwine/article/details/95848601?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.no_search_link&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.no_search_link)

[webpack-dev-server的基本配置和使用](https://www.jianshu.com/p/8b977e65a822)

## 页面跳转

当我们用vue做页面跳转时，一般不用\<a href="">标签，而是用\<router-link to="">，两者的效果都差不多。

# 环境变量process.env的问题

`vue`项目根目录下的`.env.development`和`.env.production`只有`vue-cli-service`才能自动识别，如果启动脚本使用的是`webpack-dev-server`则无法识别。

`vue-cli-service`识别的配置文件名为`vue.config.js`，而`webpack-dev-server`识别的是`webpack.config.js`、`webpack.prod.config.js`、`webpack.dev.config.js`等webpack开头的config.js配置文件

## `package.json`的`script`中定义过了`cross-env NODE_ENV=production`，为什么还要在`webpack.config.js`的`plugins`中的`webpack.DefinePlugin`里面定义一遍？

```js
// package.json
"scripts": {
    "build": "cross-env NODE_ENV=production webpack --config webpack.config.js",
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config webpack.config.js"
},

// webpack.config.js
const isDev = process.env.NODE_ENV === 'development'
plugins: [
     new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: isDev ? '"development"': '"production"'
        }
     })]
```

webpack.DefinePlugin里面定义的必要性是：你可以在你的src目录下的文件里直接使用`process.env.NODE_ENV`。

## 为什么要用cross-env

mac和windows设置/获取环境变量的方法不一样，为了统一，用`cross-env`，然后在执行启动脚本的时候webpack.config.js里就能获取到脚本中设置的环境变量，但是这个环境变量仅在启动的时候读取webpack.config.js配置文件的时候才有用，如果要在src目录下使用的话就需要用webpack.DefinePlugin定义成全局变量。

也可以不使用cross-env，直接用`--mode`参数来区分

```js
// package.json
"scripts": {
    "dev": "webpack-dev-server --mode development --progress --env.name=dev",
    "public": "webpack --mode production"
},

// webpack.config.js
module.exports = (env, argv) => {
    const isProd = argv.mode === 'production'
    return {
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: isProd ? '"production"' : '"development"'
                },
            }),
        ],
    }
}
```

