[python2.7中的字符编码问题](https://www.cnblogs.com/liaohuiqiang/p/7247393.html)

[python3 三种字符串（无前缀，前缀u，前缀b）与encode()](https://blog.csdn.net/anlian523/article/details/80504699)

------

# 编码类型：ascii, unicode, utf8

 ascii码：最早的编码，只有127个字符，包含英文字母，数字，标点符号和一些其它符号。一个字节表示一个字符。

 unicode（统一码）：一个字节不够放，全世界有各种语言的字符需要编码，于是unicode给所有的字符都设定了唯一编码。通常都是用两个字节表示一个字符（有些生僻的字要用四个字节）。所以，要理解一点：下文中提到到的unicode编码是双字节编码（一个字符两个字节）。

 uft8：对于ascii编码的那些字符，只需要1个字节，unicode给这些字符也设定2个字节，如果一篇文章全是英文（ascii字符），就浪费了很多空间（本来1个字节可以存储的，用了2个字节），所以产生了utf8。utf8是一种变长的编码方式，根据不同的符号变化字节长度，把ascii编码成1个字节，汉字通常编码成3个字节，一些生僻的字符编码成4~6个字节。

gbk：汉字编码字符集

 在计算机内存中，统一使用Unicode编码。

 在python中，建议程序过程中统一使用unicode编码，保存文件和读取文件时使用utf8（在读写磁盘文件时候用utf8进行相应的decode和encode）。

# python2的编码与解码

## python2的encoding声明

python默认使用ascii编码去解释源文件。

如果源文件中出现了非ASCII码字符，不在开头声明encoding会报错。

可以声明为utf8，告诉解释器用utf8去读取文件代码，这个时候源文件有中文也不会报错。

```python
# encoding=utf8　如果不加这一行会报错
print '解释器用相应的encoding去解释python代码'
```

## python2.7中的str和unicode

python2.7中的字符串一般有两种类型，unicode和str。（没有bytes类型，和python3不一样）

- str为字节码，会根据某种编码把字符串转成一个个字节，这个时候**字符和字节没有所谓固定的一一对应的关系**。
- unicode则是用unicode编码的字符串，这个时候**一个字符是对应两个字节**的，一一对应。

- 直接赋值字符串，类型为str，str为字节串，会按照文件开头的encoding声明来编码成一个个的字节。
- 赋值的时候在字符串前面加个u，类型则为unicode，直接按照unicode来编码。

```python
s1 = '字节串'
print type(s1) #输出　<type 'str'>，按照开头的encoding来编码成相应的字节。
print len(s1) #输出9，因为按utf8编码，一个汉字占3个字节，3个字就占9个字节。

s2 = u'统一码'
print type(s2) #输出　<type 'unicode'>，用unicode编码，2个字节1个字符。
print len(s2) #输出3，unicode用字符个数来算长度，从这个角度上看，unicode才是真正意义上的字符串类型
```

来看点现实的例子，比如我们要从一个文件中找出中所有后两位是'学习'的词语，在进行判断的时候：

```python
s = '机器学习'
s[-2:] == '学习'
# 返回false，平时写程序可能会以为相等。
# 这里的”学习是用开头的encoding声明解释的，我开头用的是utf8，汉字占3个字节，所以“学习”占了6个字节），而s[-2:]取的是最后两个”双字节“，所以不相同。

s = u'机器学习'
s[-2:] == u'学习'
# 返回true，这也是为什么说unicode是真正意义上的字符串类型。因为使用的是unicode，”学习“占的是两个”双字节“，一个"双字节“一个字。
```

对于经常处理中文字符串的人，统一用unicode就可以避免这个坑了。

虽然有些字符串处理函数用str也可以，应该是函数里面帮你处理了编码问题。

## python2.7中的encode和decode

encode的正常使用：对unicode类型进行encode，得到字节串str类型。也即是**unicode -> encode（根据指定编码） -> str**。

decode的正常使用：对str类型进行decode，得到unicode类型。也即是**str -> decode（根据指定编码） -> unicode**。

 注意：encode和decode的时候都是需要指定编码的。

因为在编码的时候要知道原来的编码是什么和按照什么新编码方式进行编码，要用到两种编码，这里默认有一个unicode，所以需要再指定一个编码方式。解码的时候也是一个道理。

这两个方法就是在unicode和str之间用指定编码进行转换。

```python
s3 = u'统一码'.encode('utf8')
print type(s3) # 输出　<type 'str'>

s4 = '字节串'.decode('utf8')
print type(s4) #输出　<type 'unicode'>
```

 encode的不正常使用：对str类型进行encode，因为encode需要的是unicode类型，这个时候python会用默认的系统编码decode成unicode类型，再用你给出编码进行encode。（注意这里的系统编码不是开头的encoding，具体例子见下文第5点）

decode的不正常使用：对unicode类型进行decode，python会用默认的系统编码encode成str类型，再用你给出的编码进行decode。

所以改好对应的系统默认编码，就算不正常使用，也不会报错啦。不过多拐了一下路，个人不喜欢这样。

## 修改系统默认编码

系统默认使用ascii编码，需要进行相应的修改。

这个编码和开头的encoding不同之处在于，开头的encoding是对于文件内容的编码。

这里的编码是一些python方法中默认使用的编码，比如对str进行encode的时候默认先decode的编码，比如文件写操作write的encode的编码

```python
import sys
reload(sys)
sys.setdefaultencoding('utf8')

s = '字节串str'

s.encode('utf8')
#等价于
s.decode(系统编码).encode('utf8')
```

关于系统默认编码发挥作用的地方，来看看另一个例子。

```python
import sys
print sys.getdefaultencoding()  # 输出ascii

s = u'厦门大学'
print s[-2:] == '大学'   # 返回False，并有warning提醒

reload(sys)
sys.setdefaultencoding('utf8')

print s[-2:] == '大学'  # 返回True 
```

根据结果得知：python在用==比较时，如果第一个操作符是unicode而第二个不是的话，会自动用系统默认编码帮第二个操作符decode。

 

**PS：**为什么需要reload(sys)呢。首先，reload是用于重新加载之前import的模块。

这里需要重新加载sys的原因是：python在加载模块时候删除了sys中的setdefaultencoding方法（可能是出于安全起见），所以需要reload这个sys模块。

## 查看文件编码

```python
import chardet
with open(filename,'r') as f:
    data = f.read()
    return chardet.detect(data)
```

 

## 文件读写

首先要记住，读出和写入，这两个文件的关口都是用str类型的，就是一个个字节。

 

python中**内置的默认open**在读取文件的时候以字节串str的形式，读出一个个字节。读取后要用正确的编码才能decode成正确的unicode，所以要知道原来在文件中的编码。

写文件的时候也是一个道理，用str类型，以字节的形式写入，这个str是以某种编码方式编码的，要注意用正确的编码方式编码，一般是按utf8编码后写文件。

如果你用unicode类型写入，python会根据系统默认编码来把unicode编码成str再写入文件。因为写入文件需要的是str，是str就写，不是我就把你转成str再写。

简单原则，尽量用str写入，避免使用默认编码，这样也不用在开头修改默认编码。

 

python中**模块codecs中的open**方法可以指定一个编码。它保证了读入和写出的字节都是按照这个指定编码进行编码的。

这样在读文件的时候：会把读出的str按照指定编码decode成unicode。

写文件的时候：如果是unicode，会根据指定编码encode成str然后写入；如果是str，会根据系统默认编码把str进行decode得到unicode，再根据指定编码encode成str进行写入。

简单原则，尽量用unicode写入，避免使用默认编码，这样也不用在开头修改默认编码。

 

注意一下，对于**其它方式读写文件**，需要自行debugger看看编码的问题。比如在python中读取excel的时候读出来就直接是unicode而不是str。

## 总结

前提：文件都是utf8格式，包括源文件和读写的数据文件。

1. **设置源文件的默认encoding和系统默认编码为utf8；**
2. **读文件拿到str类型：str -> decode('utf8') -> unicode**
3. **程序处理：用unicode**
4. **写文件：unicode -> encode('utf8') -> str，用str类型写入文件**

# python3的编码与解码

## python3的字符串类型

python3字符串虽然有三种前缀（无前缀，前缀u，前缀b），但是字符串的类型只有两种（str，bytes）

python3中，字符串的存储方式都是以Unicode字符来存储的，所以前缀带不带u，其实都一样。

str实际存储的是Unicode字符，那么也可以Unicode编码来存储str，形如\u1234。\u后面跟四个十六进制数，就可以代表一个Unicode字符。

```python
print('\u5220\u9664')  # 删除
```

## python3的encode()

不管是utf-8，还是gbk，都可以理解为一种对应关系（若干个十六进制数<-->某个字符）

str类型的字符串，在经过encode('utf-8')后，就是通过utf-8这种编码解码方式（两种方向），将Unicode字符转换为对应的以字节方式存储的若干十六进制数。

utf-8用三个字节（6个十六进制数）来表示一个中文字符，而gbk用两个字节（4个十六进制数）来表示一个中文字符。

结论：encode()函数根据括号内的编码方式，把str类型的字符串转换为bytes字符串，字符对应的若干十六进制数，根据编码方式决定。



## 总结

bytes通过decode（）转换为str（字符串）

str通过encode（）转换为bytes（二进制）

在python3中，encode()和decode()默认使用UTF-8

ASCII 、unicode 是字符集，utf-8是字符集的编码方式。

utf-8 是 unicode 字符集一种编码方式。

# python2与python3的字符串区别

python3使用unicode字符集，而python2使用ASCII，所以python2使用中文很麻烦

Python2和python3的字符串字面量都是str类型，但是这2个str不一样，python2的str等同python3的bytes，他们都是以字节为单位的数组，也叫字节串，能直接与网络/磁盘IO中的字节流相互转换

而python3的str等同于python2的Unicode，是以字符为单位的数组，是真正意义上的字符串。

encode的就是把人能理解的字符串变成计算机能理解的字节串，decode反过来。

# base64编码

Base64编码是一种“防君子不防小人”的编码方式。广泛应用于MIME协议，作为电子邮件的传输编码，生成的编码可逆，后一两位可能有“=”，生成的编码都是ascii字符。
优点：速度快，ascii字符，肉眼不可理解
缺点：编码比较长，非常容易被破解，仅适用于加密非关键信息的场合

Python2和python3的base64encode()接收的参数都是字节串，其数据类型分别是str和bytes。
所以在python2中可以直接传str，但是python3的str必须先encode成bytes类型的数据再传入base64encode()。

