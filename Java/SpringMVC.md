>参考资料
[【Spring】Spring MVC原理及配置详解](https://blog.csdn.net/jianyuerensheng/article/details/51258942)
[用servlet类返回WEB-INF中的页面](https://blog.csdn.net/qq_36326947/article/details/70537246)
[SPRING MVC系列教材 （一）- 教程](https://how2j.cn/k/springmvc/springmvc-springmvc/615.html)
[servlet的本质是什么，它是如何工作的？](https://www.zhihu.com/question/21416727)
[四张图带你了解Tomcat系统架构--让面试官颤抖的Tomcat回答系列！](https://zhuanlan.zhihu.com/p/35398064)
[深入理解Spring MVC 思想](https://www.cnblogs.com/baiduligang/p/4247164.html)
[spring框架](https://www.bilibili.com/video/av15369076?share_medium=android&share_source=copy_link&bbid=52735993-C888-4D0F-8698-A76A042C653D190944infoc&ts=1583313178110)

# Tomcat部署
以minaApp为例
0. 编译所有.java文件，在tomcat\webapps\minaApp\WEB-INF\classes目录下生成MinaServlet.class文件
1. 运行startup.bat
2. Tomcat会从目录tomcat/webapps下找到minaApp/WEB-INF/web.xml文件并加载，生成servlet-class的对象，以及url到servlet-class的映射
3. 在浏览器输入url（localhost:8080/minaApp/mina），回车后，Tomcat会去web.xml中找到对应的映射，调用相应servlet实例对象中的方法doGet()，并作出响应，由Tomcat返回给浏览器。
4. 浏览器收到响应后，通过页面渲染展现在网页上。

# SpringMVC框架
## MVC设计模式
MVC是软件工程中常用的软件架构模式，是一种分离业务逻辑与显示界面的设计方法。把软件系统分为三个基本部分：
1. 模型（Model）：处理业务逻辑、实现程序应用功能/算法、管理数据库
2. 视图（View）：图形界面的展示
3. 控制器（Controller）：接收用户请求并转发请求
常用在Web开发方面，称为Web MVC框架。
