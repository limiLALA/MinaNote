# Flask模块化处理——Blueprint

[蓝图(Blueprint)详解](https://www.cnblogs.com/wf-skylark/p/9306789.html)

Flask无法使用传统的模块化处理，它内置了一个模块化处理的类，即Blueprint。

## Blueprint是什么

Blueprint是一个存储操作方法的容器，这些操作在这个Blueprint被注册到一个应用后就可以被调用，Flask可以通过Blueprint来组织URL和处理请求，并可让应用实现模块化。

### Blueprint具备的属性

- 一个Flask应用可以有多个Blueprint

- 可将一个Blueprint注册到任何一个未使用的URL下，比如"/"、"/sample"、"/admin"或者子域名

- 在一个Flask应用中，一个模块可以注册多次

- Blueprint可以有自己的模板、静态文件或其他通用操作，不一定非得实现Flask应用的视图和函数

- 应用初始化时就要注册需要用到的Blueprint

- Blueprint不是一个完整的应用，不能独立与应用运行，必须注册到一个Flask应用中。


## Blueprint怎么用

用法与Flask应用差不多，唯一的区别就是Blueprint不能独立运行，必须注册到Flask应用对象上。

1. 创建一个蓝图对象

   ```python
   admin = flask.Blueprint(name='admin', import_name=__name__)
   ```

2. 用蓝图对象进行操作、注册路由、指定静态文件、注册模板过滤器

   ```python
   @admin.route('/')
   def admin_home():
   ​	return 'admin_home'
   ```

3. 在应用对象上注册蓝图对象

   ```python
   # flask初始化
   app = Flask(__name__)
   app.register_blueprint(blueprint=admin, url_prefix='/admin')
   ```

## 运行机制

- 每个模块都可以对应一个Blueprint对象，这个对象中存储了这个模块的所有操作

- 当直接使用Flask应用对象的route装饰器注册路由时，该操作将修改应用对象的`url_map`路由表

- 当使用Blueprint对象的route装饰器注册路由时，由于蓝图对象并没有路由表，所以这些路由会先记录在Blueprint对象内部的延迟操作记录列表`defered_functions`中

- 当Flask应用对象执行`register_blueprint()`时，将从Blueprint对象的`defered_functions`中逐条取出每一项路由，并调用Flask应用对象的`add_url_rule()`将取出的每一条路由加到自己的`url_map`路由表中。


## 蓝图的url前缀

- 当我们在应用对象上注册一个蓝图时，可以指定一个url_prefix关键字参数（这个参数默认是/）
- 在应用最终的路由表 url_map中，在蓝图上注册的路由URL自动被加上了这个前缀，这个可以保证在多个蓝图中使用相同的URL规则而不会最终引起冲突，只要在注册蓝图时将不同的蓝图挂接到不同的自路径即可
- url_for
```python
url_for('admin.index') # /admin/
```

## 注册静态路由

　　和应用对象不同，蓝图对象创建时不会默认注册静态目录的路由。需要我们在创建时指定`static_folder`参数。

下面的示例将蓝图所在目录下的`static_admin`目录设置为静态目录

```python
admin=Blueprint("admin",__name__,static_folder='static_admin')
app.register_blueprint(admin,url_prefix='/admin')
```

　　现在就可以使用/admin/static_admin/ 访问static_admin目录下的静态文件了 定制静态目录URL规则 ：可以在创建蓝图对象时使用 static_url_path 来改变静态目录的路由。下面的示例将为 static_admin 文件夹的路由设置为 /lib

```python
admin=Blueprint("admin",__name__,static_folder='static_admin',static_url_path='/lib')
app.register_blueprint(admin,url_prefix='/admin')
```

## 设置模版目录

　　蓝图对象默认的模板目录为系统的模版目录，可以在创建蓝图对象时使用 template_folder 关键字参数设置模板目录

```python
admin=Blueprint('admin',__name__,template_folder='my_templates')
```

　　注:如果在 templates 中存在和 my_templates 同名文件,则系统会优先使用 templates 中的文件

# Flask之socketio

[Flask使用flask_socketio实现websocket](https://blog.csdn.net/qq_22918243/article/details/89449850)

