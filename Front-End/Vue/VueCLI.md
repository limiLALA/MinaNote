# vue构建项目-脚手架Vue CLI

>[【vue】使用vue-cli4.0快速搭建一个项目](https://blog.csdn.net/liyunkun888/article/details/102738377)
>
>[vue-cli-analysis](https://kuangpf.com/vue-cli-analysis/)
>
>[详解 Vue 目录及配置文件之 build 目录](https://cloud.tencent.com/developer/article/1707933)

前端启动命令
`npm run start`

或

`yarn serve`

# vue ui

@vue/cli3.0增加一个可视化项目管理工具，全局安装完成cli3.0之后，可以直接在cmd输入命令：vue ui  启动即可，地址默认是localhost:8000

> [vue项目可视化管理之（vue ui）](https://blog.csdn.net/wang1006008051/article/details/93506592)
>
> [Vue UI：Vue开发者必不可少的工具](https://www.cnblogs.com/fundebug/p/vue-ui.html)

# vue-cli-service

npm run dev 之后发生了些什么？

在package.json中可以看到npm run dev`其实就是`vue-cli-service serve，这是基于webpack-dev-server进一步封装的vue前端项目启动脚本，通过`webpackDevServer`实现自动编译和热更新，同时更好的适配了vue项目的特性。

当我们在本地调试时，我们不需要配置build，但是这不意味着执行器没有进行打包，它只是偷偷地在内存里打包然后发给浏览器了而已，没有保存在本地，这是webpack-dev-server的特性。

> [vue-cli-service 机制](https://segmentfault.com/a/1190000020338771)
>
> [vue-cli-service原理研究，以及其与webpack-dev-service的区别](https://blog.csdn.net/qq_41430522/article/details/118662122)

