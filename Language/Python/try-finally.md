>参考资料  
[python的try finally (还真不简单)](https://www.cnblogs.com/xuanmanstein/p/8080629.html)

原理与java几乎一致，唯一的不同是java没有else这层逻辑，而python有
```python
try...catch...else...finally...
```
按理来说，如果catch没有捕获到异常，就会执行else，但是如果try中有return，就会跳过else，但是不会跳过finally，finally中的内容是必须执行的，除非遇到程序被意外终止，或者执行了System.exit()，或者kill。
