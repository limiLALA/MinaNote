# 参考资料

[Python 的 setup.py 详解](https://blog.csdn.net/calvinpaean/article/details/113580458)

[python的构建工具setup.py](https://www.cnblogs.com/maociping/p/6633948.html)

[setuptools详解](https://www.jianshu.com/p/ea9973091fdf)

[Python打包时添加非代码文件的坑](https://zhuanlan.zhihu.com/p/24312755)

[setuptools的package_data问题](https://www.cnblogs.com/babykick/archive/2012/01/18/2325702.html)

# 为什么要对python项目分发打包

我们平时用pip安装一些包的时候感觉非常方便，执行一条命令就可以使用了，这是因为开发者们进行了一系列繁杂的分发打包操作，将包的部署工作都事先安排好，这样用户可以即装即用，无需关心部署的细节。

# 包分发工具始祖：distutils

**distutils** 是 Python 的一个标准库，它是 Python 官方开发的一个分发打包工具，所有后续的打包工具，全部都是基于它进行开发的。**distutils** 的精髓在于编写 **setup.py**。

# setup.py是什么

打包分发最关键的一步就是写setup.py文件。他是模块分发与安装的指导文件。

# 升级版分发工具：setuptools

**setuptools** 是 distutils 增强版，不包括在标准库中。是一个优秀的，可靠的 Python 包安装与分发工具。

安装setuptools后，就有了一个叫easy_install的第三方包管理工具，但是现在用的比较少了。

[easy_install官方文档](https://setuptools.readthedocs.io/en/latest/easy_install.html)

# 分发形式：源码包和二进制包

## 源码包

源码包的安装过程要经历解压、编译、安装，它是跨平台的，安装速度较慢。

本质是压缩包，常见格式有

| 格式  | 后缀     |
| ----- | -------- |
| zip   | .zip     |
| gztar | .tar.gz  |
| bztar | .tar.bz2 |
| ztar  | .tar.Z   |
| tar   | .tar     |

### 实战打包

```bash
python setup.py sdist --formats=zip
```

意思是以zip的格式将源代码打包压缩，执行后会在当前工作目录下生成dist/src-0.0.1.zip和src.egg-info目录

```bash
easy_install dist/src-0.0.1.zip
```

要安装的时候在同样的目录使用上面的指令，然后就可以看到site-package中多了这个包。

## 二进制包

二进制包只需要解压安装即可，无需编译，速度更快。

不同平台的编译格式不一样，因此包不能通用，需要预先编译好多个平台的包。常见格式有

| 格式  | 后缀 |
| ----- | ---- |
| egg   | .egg |
| wheel | .whl |

### eggs 和 wheels 有什么区别？

Wheel 的出现是为了替代 Egg，它的本质是一个zip包，其现在被认为是 Python 的二进制包的标准格式。

以下是 Wheel 和 Egg 的**主要区别**：

- Wheel 有一个官方的 PEP427 来定义，而 Egg 没有 PEP 定义
- Wheel 是一种分发格式，即打包格式。而 Egg 既是一种分发格式，也是一种运行时安装的格式，并且是可以被直接 import
- Wheel 文件不会包含 .pyc 文件
- Wheel 使用和 PEP376 兼容的 .dist-info 目录，而 Egg 使用 .egg-info 目录
- Wheel 有着更丰富的命名规则。
- Wheel 是有版本的。每个 Wheel 文件都包含 wheel 规范的版本和打包的实现
- Wheel 在内部被 sysconfig path type 管理，因此转向其他格式也更容易

wheel 包可以通过 pip 来安装，只不过需要先安装 wheel 模块，然后再使用 pip 的命令。

```bash
$ pip install wheel
$ pip wheel --wheel-dir=/local/wheels pkg
```

# setup.py的编写

> 注：
>
> `_init_.py`，是让一个文件夹成为包的必须的文件！这个文件可以为空，但是必须得有！
>
> 下面说的根目录均指setup.py所在目录

```python
# setup.py
from setuptools import setup, find_packages
setup(
    version=get_version(),
    name="inspector",
    cmdclass={},
    package_dir={'': 'src'},
    packages=find_packages(where='src'),
    package_data={'': ['*.txt', '*.TXT', 'result/*.vue', 'result/*.html']},  # 任何包中含有这4种文件，都包含它
    install_requires=parse_requirements(),
    entry_points={'console_scripts': ['inspector = inspector.command_line:main']},
    url = "http://test.com",  
    author = "test",  
    author_email = "test@gmail.com",  
)
```

--name：指定包名。

--version：(-V) 包版本

--package_dir 告诉setuptools哪些目录下的文件被映射到哪个源码包。一个例子：package_dir = {'': 'src'}，表示“root package”中的模块都在src目录中。如不指定则默认为根目录

--packages：指定需要处理的包目录。find_packages(where='src')是一个自动打包工具，能够找到指定src目录下的所有包（包含`__init__.py`的文件夹），不需要自己再去逐一列举。如果不指定where，则默认从根目录下开始找。

--package_data：用于指定一些需要打包的非代码文件（非py文件），比如.vue文件，如果不指定则默认不打包。

--exclude_package_data：不希望被打包的文件

--install_requires：需要安装的依赖包。parse_requirements()是自定义的函数，用于读取根目录下的requirements.txt文件，得到需要安装依赖包。

--entry_points：动态发现服务和插件。console_scripts 指明了命令行工具的名称；在`inspector = inspector.command_line:main`中，等号前面指明了工具包的名称，等号后面的内容指明了程序的入口地址。console_scripts里面可以有多条记录，这样一个项目就可以制作多个命令行工具了。

--url：程序的官网地址

--include_package_data：设置为True时，执行打包的时候会自动添加`MANIFEST.in`中指定的文件。默认为False。建议不要和package_data一起使用，两者用其一即可。

--data_files：安装过程中，需要安装的静态文件，如配置文件、service文件、图片等

## MANIFEST.in

除了setup.py的package_data参数可以控制分发打包文件外，与它同级的文件`MANIFEST.in`也可以控制文件的分发。

```ini
include *.txt
recursive-include examples *.txt *.py
prune examples/sample?/build
```

这些配置，规定了如下几点：

- 所有根目录下的以 txt 为后缀名的文件，都会分发
- 根目录下的 examples 目录 和 txt、py文件都会分发
- 路径匹配上 examples/sample?/build 不会分发

`MANIFEST.in`需要放在和 setup.py 同级的顶级目录下，setuptools 会自动读取该文件（setup中include_package_data为True的情况下）。

