>参考资料  
[Django框架(一)：MVC设计模式、Django简介](https://www.cnblogs.com/liuhui0308/p/12189658.html)

# MTV设计模式
模型（Model）：负责业务对象与数据库的映射（ORM）
模板（Template）：定义html文件，展示给用户
视图（View）：处理业务逻辑，在需要的时候调用model和template
URL分发器：urlpatterns中定义一系列url到view的映射，相当于路由，负责将不同页面的请求分发给不同的view处理。
## 流程解析
浏览器发送一个Request到我们的Django后台服务，URL控制器将请求转发到对应的view函数处理。
如果不涉及数据调用，则直接返回对应的template页面给浏览器，如果涉及数据调用，则view函数先调用对应model与db交互，拿到数据后填充到template空白处返回给浏览器。
