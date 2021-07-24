# 概述
Spring是一个轻量级的java开发框架，具有轻量级，低耦合的特点。
为j2ee项目提供一站式解决方案，意味着对表示层，业务层，持久层均提供了解决方案。
其中
为表示层提供了 spring mvc 框架整合
为业务层提供了 spring 框架整合，具体使用了ioc di 等技术
为持久层提供了 orm框架，比如mybatis整合
事实上，spring框架不仅在业务层中使用，它贯穿了三个层的开发。


# 核心
spring的核心有两个
1是IOC，也就是控制反转，inverse of control。
2是AOP， 也就是面向切面编程， aspect oriented programming
另外还有一个重要的技术与IOC搭配使用，叫做DI，也就是依赖注入， dependence injection

# 重要流程
## 装配bean
>体现IOC，由spring容器控制对象的初始化
### 方法一共有三种
* ### 默认构造
```xml
 <bean id="" class=""/>
```

* ### 静态工厂
```xml
<!-- 将静态工厂创建的实例交予spring
		class 确定静态工厂全限定类名
		factory-method 确定静态方法名
	-->
	<bean id="userServiceId" class="com.itheima.c_inject.b_static_factory.MyBeanFactory" factory-method="createService"></bean>
```

* ### 动态工厂

```xml
<!-- 创建工厂实例 -->
	<bean id="myBeanFactoryId" class="com.itheima.c_inject.c_factory.MyBeanFactory"></bean>
	<!-- 获得userservice
		* factory-bean 确定工厂实例
		* factory-method 确定普通方法
	-->
	<bean id="userServiceId" factory-bean="myBeanFactoryId" factory-method="createService"></bean>

```

## 属性注入
>体现 di 对依赖的属性进行注入
### 方法一共有5种
* 构造方法注入
* setter注入
* p命名空间注入
* spEL注入
* 集合注入
