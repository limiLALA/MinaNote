

# Python第三方包

```python
pkgutil.walk_packages(path=__path__, prefix=__name__ + ‘.’)
```
递归导入此文件所在文件夹中的包

```python
for _, modname, ispkg in pkgutil.walk_packages(path=__path__, prefix=__name__ + '.'):
    if not ispkg:
        importlib.import_module(modname)
```

# Python语法

## 获取list的第一列
```Python
datas = [[1,2],[3,4],[5,6]]
y = [row[0] for row in datas]
X = [[row[j] for j in range(1, row.__len__())] for row in datas]  # 获取1~n列
```
## Numpy包的使用
### 获取ndarray的第一列
```Python
import numpy as np
datas = np.array([[1,2],[3,4],[5,6]])
y = datas[:, 0]
```
### np.vstack()&np.hstack()
* np.vstack:按垂直方向（行顺序）堆叠数组构成一个新的数组
```Python
In[3]:
import numpy as np

In[4]:
a = np.array([[1,2,3]])
a.shape
Out[4]:
(1, 3)

In [5]:
b = np.array([[4,5,6]])
b.shape
Out[5]:
(1, 3)

In [6]:
c = np.vstack((a,b)) # 将两个（1,3）形状的数组按垂直方向叠加
print(c)
c.shape # 输出形状为（2,3）
[[1 2 3]
 [4 5 6]]
Out[6]:
(2, 3)

In [7]:
a = np.array([[1],[2],[3]])
a.shape
Out[7]:
(3, 1)

In [9]:
b = np.array([[4],[5],[6]])
b.shape
Out[9]:
(3, 1)

In [10]:
c = np.vstack((a,b))  # 将两个（3,1）形状的数组按垂直方向叠加
print(c)
c.shape # 输出形状为（6,1）
[[1]
 [2]
 [3]
 [4]
 [5]
 [6]]
Out[10]:
(6, 1)
```
* np.hstack:按水平方向（列顺序）堆叠数组构成一个新的数组
```Python
In[11]:
a = np.array([[1,2,3]])
a.shape
Out[11]:
(1, 3)

In [12]:
b = np.array([[4,5,6]])
b.shape
Out[12]:
(1, 3)

In [16]:
c = np.hstack((a,b)) # 将两个（1,3）形状的数组按水平方向叠加
print(c)
c.shape  # 输出形状为（1,6）
[[1 2 3 4 5 6]]
Out[16]:
(1, 6)

In [17]:
a = np.array([[1],[2],[3]])
a.shape
Out[17]:
(3, 1)
In [18]:
b = np.array([[4],[5],[6]])
b.shape
Out[18]:
(3, 1)
In [19]:
c = np.hstack((a,b)) 将两个（3,1）形状的数组按水平方向叠加
print(c)
c.shape  # 输出形状为（3,2）
[[1 4]
 [2 5]
 [3 6]]
Out[19]:
(3, 2)
```
>参考资料：[numpy.vstack](https://docs.scipy.org/doc/numpy-1.13.0/reference/generated/numpy.vstack.html)

# 使用命令
## 同时安装py2和py3,如何在指定的版本下pip安装包
### 方法一：将要安装的python版本放在环境变量变量前面
一般都会在环境变量path中配置python的路径，如果想在py2下安装，那么将py2的环境变量放在py3 的前面
### 方法二：指定python版本安装
```cmd
py -2 -m pip install lettuce
py -3 -m pip install lettuce
```
### 方法三：使用全路径安装
```cmd
E:\Python27\python.exe -m pip install lettuce
E:\Python36\python.exe -m pip install lettuce
```
### 方法四：修改python.exe的文件名
分别在python2和python3的安装目录下找到Python.exe,然后分别修改为Python3.exe和Python2.exe。这样在命令行输入Python3和Python2就能任意使用两个版本了。
```cmd
python2 -m pip install lettuce
python3 -m pip install lettuce
```

## 常用命令行命令
### 卸载第三方包
pip uninstall xxx (xxx，需卸载的包名)
### 查看python版本号
python --version
### 查看所有第三方包
pip list
### 查看某第三包信息、版本号
pip show xxx（xxx，需查看的包名）

