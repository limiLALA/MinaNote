# Spring框架概述
# IoC(Inverse of Control) 控制反转
将创建对象的控制权反转给了Spring。
# DI(Dependency Injection) 依赖注入
A类中用到了B类，叫做A依赖B。在Spring创建A类对象时，需要先去创建B对象，然后在将其引用传给A.setB方法，设置为A的一个属性。

# 装配Bean基于XML
## 实例化方法
### 默认构造
Bean直接调用默认的构造函数来创建对象。
```Java
public class UserService{
  public UserService(){}
  public void addUser(){
    System.out.println("addUser");
  }
}
```
```xml
<bean id="userService" class="UserService"></bean>
```

### 静态工厂
调用静态工厂类的静态方法来创建对象。
```Java
//静态工厂，所有方法静态
public class MyBeanFactory{
  public static UserService createService(){
    return new UserServiceImpl();
  }
}
```
```xml
<bean id="userService" class="MyBeanFactory" factory-method="createService"></bean>
```

### 实例工厂
创建工厂实例对象，调用非静态方法创建对象。
```Java
//实例工厂，所有方法非静态
public class MyBeanFactory{
  public UserService createService(){
    return new UserServiceImpl();
  }
}
```
```xml
<bean id="myBeanFactory" class="MyBeanFactory"></bean>
<bean id="userService" factory-bean="myBeanFactory" factory-method="createService"></bean>
```

## Bean种类
### 按用途分
#### 普通Bean
spring直接创建A对象。
```XML
<bean id="" class=""></bean>
```

#### FactoryBean
需要实现FactoryBean接口，其中包含getObject方法。  
spring创建FB的实例fb，在使用时getBean("fb")会调用fb.getObject来获取特定对象实例，而不会返回fb这个对象。  
这是一种代理的思想，不直接创建A对象，而是通过工厂Bean来获取对象。  
```XML
<bean id="fb" class="FB"></bean>
```

>##### FactoryBean与BeanFactory
* BeanFactory：用于创建Bean的工厂，也就是IOC容器或对象工厂，所有的bean都是由BeanFactory（IOC容器）管理，包括FactoryBean也是由BeanFactory管理。
* FactoryBean：用于代理创建实例对象的工厂Bean

### 按生命周期分
#### singleton单例
在spring一开始运行就创建好相应的对象

#### prototype原型
只有在调用getBean的时候才会创建对象，而且每次都会创建新的对象
