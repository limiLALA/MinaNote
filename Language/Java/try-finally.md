>参考资料  
[你真的了解try{ return }finally{}中的return？](https://www.cnblogs.com/averey/p/4379646.html)

- 无论是否出现异常，最终都会执行finally；
- 如果try中有return，则会在return前先把finally执行完再执行return；
- 如果try和finally中都有return，那么会忽略try中的return而去执行finally中的return；
- 如果finally中修改了try中return的变量，那么从字节码中可以看到，它会再新生成一个变量放进本地变量表用来存放finally中修改后的变量值，而最终return回去的值还是finally修改前的值。
