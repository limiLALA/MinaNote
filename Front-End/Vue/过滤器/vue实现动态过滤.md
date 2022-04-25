# 使用vue自带的filters属性定义过滤器
代码见inputFilterDemo1.vue
引用时使用:data="tools.data|filterTools(that)"这种方式，注意tools.data为第一个入参，that为第二个入参
Vue实例中filters不依赖于当前vue实例上下文，所以在filters中使用this会发现this为undefined，如果要用，需要在data属性中声明一个that变量指向vue示例对象this
data() {
return {
that: this,
}
},
# 在computed中定义过滤函数
代码见inputFilterDemo2.vue